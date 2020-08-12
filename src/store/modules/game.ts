import router, {
  LOBBY_WORLD_COMPLETE_SIGNUP,
  LOBBY_WORLD_TRANSFER,
  BUILDER_WORLD_PLAYER_DETAIL,
} from "@/router";
import axios from "axios";
import { LOBBY_WORLD_DETAIL } from "@/router";
import { WS_URI } from "@/config.ts";
import _ from "lodash";
import Vue from "vue";
import EventBus from "@/core/eventbus.ts";
import { INTRO_WORLD_ID } from "@/config.ts";

// Want to make sure we can read THIS
// Running one more test

const MESSAGE_LIMIT = 200;

const set_initial_state = () => {
  return {
    player_id: null,
    world_id: null,
    uri: WS_URI,
    room_key: null,
    is_mobile: false,
    width: 0,

    is_connected: false,
    websocket: null,
    messages: [],

    // We want to keep track of the last received message for the various
    // message types, so that for example we only make the most recent look rom
    // message interactable (same thing for inventory, equipment etc).
    last_viewed_room_message: null,

    last_message: {},

    // Data about the item or mob being displayed in Hover or Modal
    lookup: null,

    // objects
    world: null,

    /*
       Player data, a lot of which we break out into its own state because if
       we keep everything in player, any update to it triggers the reaction
       updates.
    */
    player: null,
    player_effects: [],
    player_skills: [],
    player_level: 0,

    player_config: {},

    // assassins
    player_stance: "",
    player_archetype: "",

    // The player target is set by a kill command going through, or by
    // a notification.attack command being received, at which point
    // we look at the player.targer variable. The distinction is important
    // because sometimes player.target doesn't get set right away, or gets
    // cleared momentarily, and we want the UI to be more robust than that.
    player_target: null,

    // Master record for all tracked effects, keyed by character key
    effects: {},

    player_cooldowns: {},
    cooldown_adjustments: [],

    // Index of casts / channels that have been started and therefore should
    // not be re-animated. Indexed by expires timestamp, since it should be
    // unique per cast.
    started_casts: {},

    // Currently ongoing cast
    current_cast: null,

    // Value to keep track of what entity the user is currently hovering over,
    // if any. This is to assist in the closing or non-closing of hover popups
    // on desktop.
    hover_entity: null,

    // Value to keep track of whether a user is hovering over the desktop
    // popup so that mousing out of the interactive directive doesn't close
    // if that's where the user went.
    popup_hover: false,

    map: null,
    map_hash: {},
    room: null,

    hint: null,
    full_screen_message: null,
    // Key of the last character that's died
    last_death: null,

    // Sidebar data

    who_list: [],
    com_list: [],
    factions: [],
    room_chars: [],
  };
};

const receiveMessage = async ({
  event,
  rootState,
  state,
  dispatch,
  commit,
}) => {
  /* Main process for receiving messages */
  const message_data = JSON.parse(event.data);

  // Keep track of communication messages for the coms log
  const com_messages = [
    "cmd.chat.success",
    "notification.cmd.chat.success",
    "cmd.tell.success",
    "notification.tell",
  ];
  if (com_messages.indexOf(message_data.type) != -1) {
    commit("com_list_add", message_data);
  }

  const skip_messages = [
    "notification.shorttic",
    "notification.longtic",
    "notification.who",
  ];

  // Echo received message to console if not short / long tic
  if (skip_messages.indexOf(message_data.type) == -1) {
    console.log(`RECV ${message_data.type}`);
    console.log(message_data);
  }

  // Add message to be shown in console
  if (skip_messages.indexOf(message_data.type) == -1) {
    EventBus.$emit("new-message", message_data);
    commit("message_add", message_data);
  }

  /* Special messages processing */

  // Keep track for each type of message of the last one seen. This is useful
  // to have advanced actions be available only on the latest of a series of
  // messages. For example, actions on items in inventory & eq views
  commit("last_message_set", message_data);

  // Initial connection
  if (message_data.type == "system.connect.success") {
    commit("full_screen_message_set", "Loading world...");
    // convert map array to object
    const map = {};
    for (const room of message_data.data.map) {
      map[room.key] = room;
    }
    commit("set_map", map);
    commit("room_set", message_data.data.room);
    commit("last_viewed_room_message_set", message_data);
    commit("connected_set");
    const world_data = {
      ...state.world,
      ...message_data.data.world,
    };
    commit("world_set", world_data);
    commit("player_set", message_data.data.actor);
    commit("who_list_set", message_data.data.who_list);
    commit("full_screen_message_clear");
    router.push({ name: "game" });
    commit("ui/notification_set", "Connected.", { root: true });
  }

  // Disconection
  if (message_data.type === "system.disconnect.success") {
    if (
      message_data.data.context.split(".")[1] === INTRO_WORLD_ID &&
      rootState.auth.user.is_temporary
    ) {
      dispatch("auth/logout", null, { root: true });
      router.push({
        name: "home",
        params: { world_id: state.world.context_id },
      });
    } else {
      router.push({
        name: LOBBY_WORLD_DETAIL,
        params: { world_id: state.world.context_id },
      });
    }
    commit("reset_state");
    return;
  }

  // Successful move updates
  if (
    message_data.type === "cmd.move.success" ||
    message_data.type === "affect.flee.success" ||
    message_data.type === "notification.transport.exit" ||
    message_data.type === "affect.death" ||
    message_data.type === "affect.transfer" ||
    message_data.type === "notification.death"
  ) {
    commit("map_add", message_data.data.room);
    commit("room_set", message_data.data.room);
    commit("last_viewed_room_message_set", message_data);
    commit("player_target_set", null);
    if (message_data.data.door_states && message_data.data.door_states.length) {
      for (const data of message_data.data.door_states) {
        commit("map_update_door_state", {
          room_key: data.key,
          direction: data.direction,
          door_state: data.door_state,
        });
      }
    }
  } else if (message_data.type === "cmd.jump.success") {
    commit("map_add", message_data.data.target);
    commit("room_set", message_data.data.target);
    commit("player_target_set", null);
  }

  // Move in notifications
  if (
    message_data.type === "notification.movement.enter" ||
    message_data.type === "notification.cmd.flee.enter" ||
    message_data.type === "notification.transfer.enter" ||
    message_data.type === "notification.jump.enter"
  ) {
    commit("room_chars_add", message_data.data.actor);
  }

  // Move out notifications
  if (
    message_data.type === "notification.movement.exit" ||
    message_data.type === "notification.cmd.flee.exit" ||
    message_data.type === "notification.transfer.exit" ||
    message_data.type === "notification.jump.exit"
  ) {
    commit("room_chars_remove", message_data.data.actor);

    if (state.player_target.key === message_data.data.actor.key) {
      commit("player_target_set", null);
    }
  }

  // Update room chars on attack for state reasons
  if (message_data.type === "notification.combat.attack") {
    commit("room_chars_update", message_data.data.actor);
    commit("room_chars_update", message_data.data.target);
  }

  // Open & close messages
  if (
    message_data.type === "door.open" ||
    message_data.type === "door.close" ||
    message_data.type === "notification.door.open" ||
    message_data.type === "notification.door.close" ||
    message_data.type === "notification.door.reset"
  ) {
    commit("map_add", message_data.data.room);
    if (message_data.data.exit_room) {
      commit("map_add", message_data.data.exit_room);
    }
  }

  // Anything that has an actor who is the connected player
  if (
    message_data.data["actor"] &&
    state.player &&
    message_data.data["actor"].key === state.player.key
  ) {
    commit("player_set", message_data.data.actor);
    if (message_data.data.actor && message_data.data.actor.room) {
      commit("set_room_key", message_data.data.actor.room.key);
    }
  }

  // Inventory affect
  if (message_data.type === "affect.inventory.remove") {
    commit("player_remove_from_inventory", message_data.data.items);
  }

  // Room updating on look
  if (
    message_data.type === "cmd.jump.success" ||
    (message_data.type === "cmd.look.success" &&
      message_data.data.target_type === "room")
  ) {
    commit("room_set", message_data.data.target);
    commit("map_add", message_data.data.target);
    commit("last_viewed_room_message_set", message_data);
  }

  // On death, clear out combat window
  if (message_data.type === "affect.death") {
    commit("player_target_set", null);
  }

  // Track current casts
  if (
    message_data.data &&
    message_data.data.skill &&
    (message_data.data.method === "cast" ||
      message_data.data.method === "channel") &&
    message_data.data.duration !== 0
  ) {
    commit("current_cast_set", message_data);
  }

  // Track effects for all chars
  if (message_data.type === "effect.start") {
    commit("effects_add", message_data.data);
    setTimeout(() => {
      commit("effects_remove", message_data.data);
    }, message_data.data.duration * 1000);

    if (message_data.data.target === state.player.key) {
      commit("player_effects_add", message_data.data);
    }
  }

  // Effects expiration
  if (message_data.type === "effect.end") {
    if (message_data.data.target === state.player.key) {
      commit("player_effects_remove", message_data.data);
      commit("effects_remove", message_data.data);
    }
  }

  // Special case of effects expiration: anathema & combust
  if (message_data.type === "notification.combat.attack") {
    if (message_data.data.attack === "combust") {
      commit("effects_consume", {
        actor_key: message_data.data.actor.key,
        target_key: message_data.data.target.key,
        effect_code: "burn",
      });
    } else if (message_data.data.attack === "anathema") {
      commit("effects_consume", {
        actor_key: message_data.data.actor.key,
        target_key: message_data.data.target.key,
        effect_code: "wrack",
      });
    }
  }

  // Player cooldowns
  if (message_data.type === "skill.cooldown.start") {
    commit("player_cooldown_start", message_data.data);
    EventBus.$emit("cooldown-start", message_data.data);
    setTimeout(() => {
      commit("player_cooldown_clear", message_data.data.skill);
    }, message_data.data.duration * 1000);
  }

  if (message_data.type === "skill.cooldown.adjust") {
    EventBus.$emit("cooldown-adjustment", message_data.data);
  }

  // Hint processing
  if (
    (message_data.type === "cmd.move.success" ||
      message_data.type === "system.connect.success") &&
    message_data.data.room.hint
  ) {
    commit("hint_set", message_data.data.room.hint);
  } else if (
    message_data.type === "cmd.look.success" &&
    message_data.data.target.hint
  ) {
    commit("hint_set", message_data.data.target.hint);
  }
  if (
    message_data.type === "room_write" &&
    message_data.text ===
      "Wincing in pain, you try to familiarize yourself with your surroundings."
  ) {
    commit("hint_set", "2:Enter 'look' or 'l'");
  }

  // Resets
  if (message_data.type === "cmd.reset.success") {
    commit("full_screen_message_set", "Resetting...");
    dispatch("world_enter", {
      player_id: state.player.id,
      world_id: state.world.id,
    });
  }

  if (message_data.type === "notification.death") {
    commit("last_death_set", message_data.data.deceased.key);
  }

  // Complete
  if (message_data.type === "cmd.completeworld.success") {
    if (rootState.auth.user.is_temporary) {
      router.push({
        name: LOBBY_WORLD_COMPLETE_SIGNUP,
        params: {
          player_id: state.player.id,
          world_id: state.world.id,
        },
      });
    } else {
      router.push({
        name: LOBBY_WORLD_TRANSFER,
        params: {
          player_id: state.player.id,
          world_id: state.world.id,
        },
      });
    }
  }

  // Who list update
  if (message_data.type === "notification.who") {
    commit("who_list_set", message_data.data);
  }

  // Focus update
  if (message_data.type === "cmd.focus.success") {
    commit("player_focus_set", message_data.data.focus);
  }

  // Target setting
  if (message_data.type === "cmd.kill.success") {
    // If we're in an initial hit, the backend takes care of setting actor.target
    // for that message (but there's a delay afterwards). It would be better if it
    // set data.target instead, but as a band-aid we're taking advantage of this.
    commit("player_target_set", message_data.data.actor.target);
  } else if (message_data.type === "notification.combat.attack") {
    // We only set the player target if it's a player auto-attacking, essentially.
    // And we look at the player's target, rather than setting it when they're
    // the recipient of one, since he could be attacked by multiple enemies.
    if (message_data.data.actor.key === state.player.key) {
      commit("player_target_set", message_data.data.target);
    }
  } else if (message_data.type === "affect.flee.success") {
    commit("player_target_set", null);
  }
};

const actions = {
  world_enter: async ({ commit, dispatch, state }, { player_id }) => {
    commit("reset_state");
    commit(
      "ui/notification_set",
      { text: "Entering world...", expires: false },
      { root: true }
    );
    try {
      const resp = await axios.post(`/game/enter/`, {
        player_key: `player.${player_id}`,
      });
      commit("world_set", resp.data.world);
      commit("player_config_set", resp.data.player_config);

      commit("pregame_set", {
        player_id: player_id,
      });
      dispatch("openWebSocket");
    } catch (e) {
      let error_message = "Unable to enter world.";
      if (
        e.response.status === 400 &&
        e.response.data &&
        e.response.data.length
      ) {
        error_message = e.response.data[0];
      }
      commit("ui/notification_set_error", error_message, {
        root: true,
      });
    }
  },

  openWebSocket: async ({ commit, rootState, state, dispatch }) => {
    const token = rootState.auth.token;

    const onopen = () => {
      dispatch("sendWSMessage", {
        type: "system.connect",
        data: { player_key: "player." + state.player_id },
      });
    };

    const onmessage = (event) => {
      receiveMessage({ event, rootState, state, dispatch, commit });
    };
    commit("openWS", { onopen, onmessage });
  },

  sendWSMessage: async ({ rootState, state }, payload) => {
    console.log(`SEND ${payload.type}`);
    console.log(payload);
    payload.token = rootState.auth.token;
    if (state.websocket) {
      state.websocket.send(JSON.stringify(payload));
    }
  },

  cmd: async ({ dispatch, state, commit }, cmd) => {
    // Process a string command as entered by a user.

    // If, rather than passing a string, we pass an object, the
    // cmd is assumed to be in object.cmd, and then a number of
    // options are parsed in the rest of the attributes:
    // - silent: whether to actually echo back the command or not
    let silent = false;
    if (typeof cmd == "object") {
      const payload = { ...cmd };
      cmd = payload.cmd;
      if (payload.silent) {
        silent = true;
      }
    }

    cmd = cmd.toLowerCase();

    // Special focus processing
    if (
      state.player.focus &&
      (cmd === "k" || cmd === "ki" || cmd === "kil" || cmd === "kill")
    ) {
      // Kill with no arguments
      cmd = `${cmd} ${state.player.focus}`;
    } else {
      // F commands
      const cmd_tokens = cmd.split(" ");
      if (cmd_tokens.length === 2) {
        const arg = cmd_tokens[1];
        if (new RegExp(arg).exec("focus")) {
          cmd = `${cmd_tokens[0]} ${state.player.focus}`;
        }
      }
    }

    const message = { type: "cmd.text", text: cmd, echo: true };

    // Echo user input back to console
    if (!silent) {
      commit("message_add", message);
    }

    // Support semicolon commands
    var subCommands = cmd.split(";");
    if (subCommands.length > 1) {
      for (const subcmd of subCommands) {
        dispatch("cmd", { cmd: subcmd, silent: true });
      }
      return;
    }

    // Quit special case
    if (cmd.toLowerCase() === "quit") {
      dispatch("sendWSMessage", { type: "system.disconnect" });
      commit("full_screen_message_set", "Disconnecting...");
      return;
    }

    dispatch("sendWSMessage", message);
    if (state.hint) {
      commit("hint_clear");
    }

    commit("lookup_clear");
  },

  cmd_structured: async ({ dispatch, commit, state }, payload) => {
    payload.echo = true;
    commit("message_add", payload);
    dispatch("sendWSMessage", payload);
    if (state.hint) {
      commit("hint_clear");
    }
  },

  play: async ({ commit, dispatch }) => {
    const resp = await axios.post("/game/play/");
    commit("auth/auth_set", resp.data.token, { root: true });
    commit("auth/user_set", resp.data.user, { root: true });
    const player_id = resp.data.player.id;
    dispatch("world_enter", { player_id });
  },

  save_player_config: async ({ commit, state }, config) => {
    state.player_id;
    const resp = await axios.post("/game/player/config/", config, {
      headers: { "X-PLAYER-ID": state.player.id },
    });
    commit("player_config_set", config);
    Vue.nextTick(() => {
      // Though this gets correcly caught by the console, the scroll down does
      // not actually seem to happen, oddly enough.
      EventBus.$emit("scroll-down");
    });
  },
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const mutations = {
  message_add: (state, message) => {
    message.receive_ts = new Date().getTime();
    message.message_id = uuidv4();

    state.messages.push(message);
    const messages_length = state.messages.length;
    if (messages_length > MESSAGE_LIMIT) {
      state.messages = state.messages.slice(
        messages_length - MESSAGE_LIMIT,
        messages_length
      );
    }
  },

  last_viewed_room_message_set: (state, message) => {
    state.last_viewed_room_message = message;
  },

  last_message_set: (state, message) => {
    Vue.set(state.last_message, message.type, message);
  },

  messages_clear: (state) => {
    state.messages = [];
  },

  openWS: (state, { onopen, onmessage }) => {
    state.websocket = new WebSocket(state.uri);
    state.websocket.onopen = onopen;
    state.websocket.onmessage = onmessage;
  },

  player_set: (state, player) => {
    state.player = {
      ...state.player,
      ...player,
    };

    // Player component updates, only if needed

    if (player.skills && !_.isEqual(state.player_skills, state.player.skills)) {
      state.player_skills = state.player.skills;
    }

    if (player.stance && player.stance != state.player_stance) {
      state.player_stance = player.stance;
    }

    if (player.archetype && player.archetype != state.player_archetype) {
      state.player_archetype = player.archetype;
    }

    if (player.level && player.level != state.player_level) {
      state.player_level = player.level;
    }
  },

  player_remove_from_inventory: (state, items) => {
    const inv = _.differenceWith(state.player.inventory, items, (a, b) => {
      return a.key == b.key;
    });
    Vue.set(state.player, "inventory", inv);
  },

  player_focus_set: (state, focus) => {
    state.player = {
      ...state.player,
      focus: focus,
    };
  },

  player_effects_add: (state, effect) => {
    effect.start = new Date().getTime();
    if (!state.player_effects.length) {
      state.player_effects = [effect];
      return;
    }

    // Filter out the existing effects effects of the same
    // actor & code combination
    const applied_effects = _.filter(
      state.player_effects,
      (existing_effect) => {
        return (
          existing_effect.code !== effect.code ||
          existing_effect.actor !== effect.actor
        );
      }
    );

    applied_effects.push(effect);
    state.player_effects = applied_effects;
  },

  player_effects_remove: (state, effect) => {
    const kept_effects: {}[] = [];
    for (const existing_effect of state.player_effects) {
      if (existing_effect["expires"] != effect["expires"]) {
        kept_effects.push(existing_effect);
      }
    }
    state.player_effects = kept_effects;
  },

  player_effects_clear: (state) => {
    state.player_effects = [];
  },

  effects_add: (state, effect) => {
    effect.start = new Date().getTime();
    const char_effects = state.effects[effect.target] || [];

    if (!char_effects.length) {
      char_effects.push(effect);
      Vue.set(state.effects, effect.target, char_effects);
      return;
    }

    const applied_effects = _.filter(char_effects, (existing_effect) => {
      return (
        existing_effect.code !== effect.code ||
        existing_effect.actor !== effect.actor
      );
    });
    applied_effects.push(effect);

    Vue.set(state.effects, effect.target, applied_effects);
  },

  effects_remove: (state, effect) => {
    const char_effects = state.effects[effect.target] || [];
    if (!char_effects.length) return;

    const applied_effects: {}[] = [];
    for (const existing_effect of char_effects) {
      if (effect.key !== existing_effect.key) {
        applied_effects.push(existing_effect);
      }
    }

    Vue.set(state.effects, effect.target, applied_effects);
  },

  effects_consume: (state, { actor_key, target_key, effect_code }) => {
    const char_effects = state.effects[target_key];
    if (!char_effects || !char_effects.length) return;

    const kept_effects: {}[] = _.filter(char_effects, (effect) => {
      return (
        effect.actor != actor_key &&
        effect.target != target_key &&
        effect.code != effect_code
      );
    });
    Vue.set(state.effects, target_key, kept_effects);
  },

  player_cooldown_start: (state, message_data) => {
    message_data.start = new Date().getTime();
    Vue.set(state.player_cooldowns, message_data.skill, message_data);
  },

  player_cooldown_adjust: (state, { skill, adjustment }) => {
    if (state.player_cooldowns[skill]) {
      state.player_cooldowns[skill].adjustment = adjustment;
    }
  },

  player_cooldown_clear: (state, skill) => {
    Vue.delete(state.player_cooldowns, skill);
  },

  player_config_set: (state, player_config) => {
    state.player_config = player_config;
  },

  set_map: (state, map) => {
    state.map = map;
  },
  map_add: (state, room) => {
    state.map = {
      ...state.map,
      [room.key]: room,
    };
  },
  map_update_door_state: (state, { room_key, direction, door_state }) => {
    let room = state.map[room_key];
    if (!room) return;
    const existing_state = room[`${direction}_door_state`];
    if (existing_state != door_state) {
      room[`${direction}_door_state`] = door_state;
    }
    state.map = {
      ...state.map,
      [room.key]: room,
    };
  },
  set_room_key: (state, room_key) => {
    state.room_key = room_key;
  },
  // mutation called after a successful game entry from the API
  // side, but before the Websocket side.
  pregame_set: (state, { player_id }) => {
    state.player_id = player_id;
    //state.world_id = world_id;
  },
  world_set: (state, world) => {
    state.world = world;
    state.factions = world.factions;
  },

  width_set: (state, width) => {
    state.width = width;
    if (width >= 768) {
      state.is_mobile = false;
    } else {
      state.is_mobile = true;
    }
  },

  room_set: (state, room) => {
    state.room = room;
    state.room_chars = room.chars;
  },

  room_chars_add: (state, char) => {
    state.room_chars.push(char);
  },

  room_chars_update: (state, char) => {
    const room_chars: {}[] = [];
    for (const existing_char of state.room_chars) {
      if (existing_char.key === char.key) {
        room_chars.push(char);
      } else {
        room_chars.push(existing_char);
      }
    }
    state.room_chars = room_chars;
  },

  room_chars_remove: (state, char) => {
    const room_chars: {}[] = [];
    for (const existing_char of state.room_chars) {
      if (existing_char.key != char.key) {
        room_chars.push(existing_char);
      }
    }
    state.room_chars = room_chars;
  },

  connected_set: (state) => {
    state.is_connected = true;
  },

  connected_clear: (state) => {
    state.is_connected = false;
  },

  lookup_set: (state, lookup) => {
    state.lookup = lookup;
  },

  lookup_clear: (state) => {
    state.lookup = null;
  },

  hint_set: (state, hint) => {
    state.hint = hint;
  },

  hint_clear: (state) => {
    state.hint = null;
  },

  full_screen_message_set: (state, message) => {
    state.full_screen_message = message;
  },

  full_screen_message_clear: (state) => {
    state.full_screen_message = "";
  },

  reset_state: (state) => {
    const new_state = set_initial_state();
    for (const attr in new_state) {
      state[attr] = new_state[attr];
    }
  },

  last_death_set: (state, key) => {
    state.last_death = key;
  },

  last_death_clear: (state) => {
    state.last_death = null;
  },

  started_casts_add: (state, { expires }) => {
    Vue.set(state.started_casts, expires, true);
  },

  hover_entity_set: (state, entity) => {
    state.hover_entity = entity;
  },

  popup_hover_set: (state, value: true | false) => {
    state.popup_hover = value;
  },

  player_target_set: (state, target) => {
    state.player_target = target;
  },

  current_cast_set: (state, data) => {
    state.current_cast = data;
  },

  who_list_set: (state, who_list) => {
    state.who_list = who_list;
  },

  com_list_add: (state, com) => {
    state.com_list.push(com);
  },
};

const getters = {
  consoleMessages: (state) => {
    return _.filter(state.messages, (message) => {
      return message.text || message.type === "system.connect.success";
    });
  },
};

export default {
  namespaced: true,
  state: set_initial_state(),
  actions,
  mutations,
  getters,
};
