import router, {
  LOBBY_WORLD_COMPLETE_SIGNUP,
  LOBBY_WORLD_TRANSFER
} from "@/router";
import axios from "axios";
import { LOBBY_WORLD_DETAIL } from "@/router";
import { WS_URI } from "@/config.ts";
import _ from "lodash";
import Vue from "vue";
import EventBus from "@/core/eventbus.ts";

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

    // Data about the item or mob being displayed in Hover or Modal
    lookup: null,

    // objects
    world: null,
    player: null,
    player_effects: [],

    // Master record for all tracked effects, keyed by character key
    effects: {},

    player_cooldowns: {},
    cooldown_adjustments: [],

    // Index of casts / channels that have been started and therefore should
    // not be re-animated. Indexed by expires timestamp, since it should be
    // unique per cast.
    started_casts: {},

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
    last_death: null
  };
};

const receiveMessage = async ({
  event,
  rootState,
  state,
  dispatch,
  commit
}) => {
  /* Main process for receiving messages */
  const message_data = JSON.parse(event.data);

  const skip_messages = ["notification.shorttic", "notification.longtic"];

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
    commit("connected_set");
    const world_data = {
      ...state.world,
      ...message_data.data.world
    };
    commit("world_set", world_data);
    commit("player_set", message_data.data.actor);
    commit("full_screen_message_clear");
    router.push({ name: "game" });
  }

  // Disconection
  if (message_data.type === "system.disconnect.success") {
    router.push({
      name: LOBBY_WORLD_DETAIL,
      params: { world_id: state.world.context_id }
    });
    commit("reset_state");
    return;
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

  // Update the room on successful move
  if (
    message_data.type === "cmd.move.success" ||
    message_data.type === "cmd.flee.success" ||
    message_data.type === "notification.transport.exit"
  ) {
    commit("map_add", message_data.data.room);
    commit("room_set", message_data.data.room);
  }

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
    }
  }

  // Player cooldowns
  if (message_data.type === "skill.cooldown.start") {
    commit("player_cooldown_start", message_data.data);
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
      world_id: state.world.id
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
          world_id: state.world.id
        }
      });
    } else {
      router.push({
        name: LOBBY_WORLD_TRANSFER,
        params: {
          player_id: state.player.id,
          world_id: state.world.id
        }
      });
    }
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
        player_key: `player.${player_id}`
      });
      commit("world_set", resp.data);

      commit("pregame_set", {
        player_id: player_id
      });
      dispatch("openWebSocket");
    } catch (e) {
      commit("ui/notification_set_error", "Unable to enter world.", {
        root: true
      });
    }
  },

  openWebSocket: async ({ commit, rootState, state, dispatch }) => {
    const token = rootState.auth.token;

    const onopen = () => {
      dispatch("sendWSMessage", {
        type: "system.connect",
        data: { player_key: "player." + state.player_id }
      });
    };

    const onmessage = event => {
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
  }
};

const mutations = {
  message_add: (state, message) => {
    message.receive_ts = new Date().getTime();

    if (
      message.type === "cmd.flee.success" ||
      message.type === "cmd.move.success" ||
      message.type === "system.connect.success"
    ) {
      state.last_viewed_room_message = message;
    } else if (
      message.type === "cmd.jump.success" ||
      (message.type === "cmd.look.success" &&
        RegExp(/@\d+:room\./).test(message.data.target.key))
    ) {
      state.last_viewed_room_message = message;
    }

    state.messages.push(message);
    const messages_length = state.messages.length;
    if (messages_length > MESSAGE_LIMIT) {
      state.messages = state.messages.slice(
        messages_length - MESSAGE_LIMIT,
        messages_length
      );
    }
  },

  messages_clear: state => {
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
      ...player
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
    const applied_effects = _.filter(state.player_effects, existing_effect => {
      return (
        existing_effect.code !== effect.code ||
        existing_effect.actor !== effect.actor
      );
    });

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

  player_effects_clear: state => {
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

    const applied_effects = _.filter(char_effects, existing_effect => {
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

  player_cooldown_start: (state, message_data) => {
    message_data.start = new Date().getTime();
    state.player_cooldowns = {
      ...state.player_cooldowns,
      [message_data.skill]: message_data
    };
  },

  player_cooldown_adjust: (state, { skill, adjustment }) => {
    if (state.player_cooldowns[skill]) {
      state.player_cooldowns[skill].adjustment = adjustment;
    }
  },

  player_cooldown_clear: (state, skill) => {
    Vue.delete(state.player_cooldowns, skill);
  },

  set_map: (state, map) => {
    state.map = map;
  },
  map_add: (state, room) => {
    state.map = {
      ...state.map,
      [room.key]: room
    };
    //Vue.set(state, .map, room.key, room);
    //state.map[room.key] = room;
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
  },

  connected_set: state => {
    state.is_connected = true;
  },

  connected_clear: state => {
    state.is_connected = false;
  },

  lookup_set: (state, lookup) => {
    state.lookup = lookup;
  },

  lookup_clear: state => {
    state.lookup = null;
  },

  hint_set: (state, hint) => {
    state.hint = hint;
  },

  hint_clear: state => {
    state.hint = null;
  },

  full_screen_message_set: (state, message) => {
    state.full_screen_message = message;
  },

  full_screen_message_clear: state => {
    state.full_screen_message = "";
  },

  reset_state: state => {
    const new_state = set_initial_state();
    for (const attr in new_state) {
      state[attr] = new_state[attr];
    }
  },

  last_death_set: (state, key) => {
    state.last_death = key;
  },

  last_death_clear: state => {
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
  }
};

const getters = {
  consoleMessages: state => {
    return _.filter(state.messages, message => {
      return message.text || message.type === "system.connect.success";
    });
  }
};

export default {
  namespaced: true,
  state: set_initial_state(),
  actions,
  mutations,
  getters
};