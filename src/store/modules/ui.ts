import { UI_ACTIONS, UI_MUTATIONS } from "@/constants";
import { FORGE_WS_URI } from "@/config";

const state = {
  notification: "",
  notificationType: "success",
  notification_expires: 3000,
  modal: "",
  modal_data: {}, // data that can optionally be passed to the modal when invoking it,
  editingField: false,

  forge_ws: null,
};

const getters = {};

const actions = {
  process_error_response: ({ commit }, error) => {
    if (error.response) {
      if ("non_field_errors" in error.response.data) {
        const errorMsg = error.response.data.non_field_errors;
        commit(UI_MUTATIONS.SET_NOTIFICATION_ERROR, errorMsg);
      }
    } else if (error.request) {
      commit(UI_MUTATIONS.SET_NOTIFICATION_ERROR, "Error sending request.");
    }
  },

  connect_forge_ws: async ({ commit, dispatch, rootState }) => {
    // We only use a Forge websocket connection for authenticated users
    if (!rootState.auth.token) {
      return;
    }

    const uri = FORGE_WS_URI + '?token=' + rootState.auth.token;
    const ws = new WebSocket(uri);

    const heartbeatInterval = 30000; // 30 seconds
    let heartbeatHandle;

    ws.onopen = () => {
      heartbeatHandle = setInterval(() => {
        ws.send(JSON.stringify({type: 'heartbeat'}));
      }, heartbeatInterval);
      console.log('Connected to Forge Websocket.')
    };

    ws.onmessage = msg => {
      const data = JSON.parse(msg.data);
      dispatch("receive_forge_ws_message", data);
    };

    ws.onclose = () => {
      if (heartbeatHandle) {
        clearInterval(heartbeatHandle);
      }
    };

    commit('set_forge_ws', ws);
  },

  aconnect_forge_ws: ({ commit, dispatch, rootState }) => {
    return new Promise((resolve, reject) => {
      // We only use a Forge websocket connection for authenticated users
      if (!rootState.auth.token) {
        reject(new Error("No authentication token found."));
        return;
      }

      const uri = FORGE_WS_URI + '?token=' + rootState.auth.token;
      const ws = new WebSocket(uri);

      const heartbeatInterval = 30000; // 30 seconds
      let heartbeatHandle;

      ws.onopen = () => {
        heartbeatHandle = setInterval(() => {
          ws.send(JSON.stringify({type: 'heartbeat'}));
        }, heartbeatInterval);
        console.log('Connected to Forge Websocket.');
        commit('set_forge_ws', ws);
        resolve(ws);
      };

      ws.onmessage = msg => {
        const data = JSON.parse(msg.data);
        dispatch("receive_forge_ws_message", data);
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        reject(error);
      };

      ws.onclose = () => {
        if (heartbeatHandle) {
          clearInterval(heartbeatHandle);
        }
      };
    });
  },

  forge_ws_disconnected: ({ commit }) => {
    commit('set_forge_ws', null);
  },

  // Most important routine for handling messages from the Forge websocket
  receive_forge_ws_message: ({ dispatch, commit, rootState }, data) => {

    console.log("Receive from Forge WS: ", data)

    // Handle a player entering a world
    if (data.type === 'world_entered') {
      dispatch('game/enter_ready_world', {
        player_id: data.player_id,
        world: data.world,
        player_config: data.player_config,
        nexus_name: data.nexus_name
      }, { root: true });

    // Handle a message published to a channel
    } else if (data.type === "world_exited") {
      // Relay the world_exited message to the game module
      dispatch('game/world_exited', data, { root: true });
    } else if (data.type === 'pub') {

      // The world has changed, update the builder state
      if (data.subscription === 'builder.admin') {
        commit('builder/worlds/world_admin_set', data.data, {root: true});
      }

      if (data.subscription === 'staff.panel') {
        commit('staff/staff_panel_set', data.data, {root: true});
      }

    } else if (data.type === 'notify') {
      if (data.error) {
        commit('notification_set_error', data.message);
      } else {
        commit('notification_set', data.message);
      }
    }
  },

  send_forge_ws: ({ state }, data) => {
    if (state.forge_ws) {
      state.forge_ws.send(JSON.stringify(data));
      console.log('sent to forge ws: ', data);
    }
  }

};

const mutations = {
  editing_field_set: state => {
    state.editingField = true;
  },

  editing_field_clear: state => {
    state.editingField = false;
  },

  notification_set: (state, notification) => {
    /*
      Can be invoked either by just passing the notification stream,
      or by passing an object. If with an object, additional options
      may be specified:
      - text: the text of the notification
      - expires: how long to wait to expire the message, where a false
        value means never expire.
      - type: success or error
    */
    let expires = 3000;
    if (typeof notification === "string") {
      state.notification = notification;
      state.notificationType = "success";
    } else {
      // assume object
      state.notification = notification.text;
      if (notification.expires !== undefined) {
        expires = notification.expires;
      }
      state.notificationType = notification.type || "success";
    }
    state.notification_expires = expires;
  },

  notification_set_error: (state, notification) => {
    state.notification = notification;
    state.notificationType = "error";
    state.notification_expires = 5000;
  },

  notification_clear(state) {
    state.notification = "";
  },

  modal_set: (state, modal) => {
    state.modal = modal;
  },

  modal_clear: (state, modal) => {
    state.modal = "";
  },

  modal_set_extra_data: (state, modal_data) => {
    state.modal_data = modal_data;
  },

  clearNotification(state) {
    state.notification = "";
  },

  set_forge_ws: (state, ws) => {
    state.forge_ws = ws;
  },


};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
