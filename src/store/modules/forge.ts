/*
  Module for interfacing with the Forge websocket.
*/

import { FORGE_WS_URI } from "@/config";

const state = {
  ws: null,
};

const actions = {
  send: async ({ dispatch, state }, data) => {
    if (!state.ws
      || state.ws.readyState === WebSocket.CLOSED
      || state.ws.readyState === WebSocket.CLOSING) {
      await dispatch("connect");
    }
    state.ws.send(JSON.stringify(data));
  },

  receive: async ({ dispatch }, data) => {
    console.log('Received Forge Websocket message:', data);

    // job_complete
    if (data.type === 'job_complete') {
      await dispatch('job_complete', data);
    }

    // pub
    if (data.type === 'pub') {
      await dispatch('pub', data)
    }
  },

  // Receive actions

  job_complete: async ({ commit, dispatch }, data) => {
    // Enter World
    if (data.job === 'enter_world') {
      if (data.status === 'error') {
        const error = data.job_data.error || 'Error entering world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        await dispatch('game/enter_ready_world', {
          player_id: data.job_data.player_id,
          world: data.job_data.world,
          player_config: data.job_data.player_config,
          nexus_name: data.job_data.nexus_name,
          ws_uri: data.job_data.ws_uri,
          motd: data.job_data.motd,
        }, { root: true });
      }
    }

    // Exit World
    if (data.job === 'exit_world') {
      if (data.status === 'error') {
        const error = data.error || 'Error exiting world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        await dispatch('game/world_exited', data.job_data, { root: true });
      }
    }

    // Start World
    if (data.job == "start_world") {
      if (data.status === 'error') {
        const error = data.job_data.error || 'Error starting world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'World started.', { root: true });
      }
    }

    // Stop World
    if (data.job == "stop_world") {
      if (data.status === 'error') {
        const error = data.job_data.error || 'Error stopping world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'World stopped.', { root: true });
      }
    }

    // Kill World
    if (data.job == "kill_world") {
      if (data.status === 'error') {
        const error = data.job_data.error || 'Error killing world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'World killed.', { root: true });
      }
    }

    // Initialize
    if (data.job == "initialize") {
      if (data.status === 'error') {
        const error = data.error || 'Error initializing world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Initialization complete.', { root: true });
      }
    }

    // Teardown
    if (data.job == "teardown") {
      if (data.status === 'error') {
        const error = data.error || 'Error tearing down world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Teardown complete.', { root: true });
      }
    }

    // Nexus Built
    if (data.job == "build_nexus") {
      if (data.status === 'error') {
        const error = data.error || 'Error starting nexus.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Nexus started.', { root: true });
        if (data.job_data.nexus_id) {
          const nexus_promise = dispatch('staff/nexus_fetch', data.job_data.nexus_id, { root: true });
          const nexus_data_promise = dispatch('staff/nexus_data_fetch', data.job_data.nexus_id, { root: true });
          await Promise.all([nexus_promise, nexus_data_promise]);
        }
      }
    }


    // Nexus Deleted
    if (data.job == "delete_nexus") {
      if (data.status === 'error') {
        const error = data.error || 'Error deleting nexus.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Nexus deleted.', { root: true });
        if (data.job_data.nexus_id) {
          const nexus_promise = dispatch('staff/nexus_fetch', data.job_data.nexus_id, { root: true });
          const nexus_data_promise = dispatch('staff/nexus_data_fetch', data.job_data.nexus_id, { root: true });
          await Promise.all([nexus_promise, nexus_data_promise]);
        }
      }
    }

    // Nexus Rebuilt
    if (data.job == "rebuild_nexus") {
      if (data.status === 'error') {
        const error = data.error || 'Error rebuilding nexus.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Nexus rebuilt.', { root: true });
        if (data.job_data.nexus_id) {
          const nexus_promise = dispatch('staff/nexus_fetch', data.job_data.nexus_id, { root: true });
          const nexus_data_promise = dispatch('staff/nexus_data_fetch', data.job_data.nexus_id, { root: true });
          await Promise.all([nexus_promise, nexus_data_promise]);
        }
      }
    }

    // Toggle Maintenance
    if (data.job == "toggle_maintenance_mode") {
      if (data.status === 'error') {
        const error = data.error || 'Error toggling maintenance.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        const maintenance_mode = data.job_data.maintenance_mode ? 'ON' : 'OFF';
        commit(
          'ui/notification_set',
          'Maintenance ' + maintenance_mode,
          { root: true });
      }
    }

    // Broadcast Message
    if (data.job == "broadcast") {
      if (data.status === 'error') {
        const error = data.error || 'Error broadcasting message.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'Message broadcasted.', { root: true });
      }
    }
  },

  pub: async ({ commit }, data) => {
    const pub = data.pub;
    // builder.admin
    if (pub === 'builder.admin') {
      commit('builder/worlds/admin/world_admin_set',
        data.pub_data,
        { root: true });
    }

    if (pub === 'staff.panel') {
      commit('staff/staff_panel_set',
        data.pub_data,
        { root: true });
    }
  },

  // Initial Connection - async
  connect: ({ commit, dispatch, rootState }) => {
    console.log('Connecting to Forge Websocket...')
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
          ws.send(JSON.stringify({ type: 'heartbeat' }));
        }, heartbeatInterval);
        console.log('Connected to Forge Websocket.');
        commit('set_ws', ws);
        resolve(ws);
      };

      ws.onmessage = msg => {
        dispatch("receive", JSON.parse(msg.data));
      };

      ws.onerror = (error) => {
        console.log('Error connecting to Forge Websocket.', error)
        // commit('ui/notification_set_error', 'Error connecting to Forge Websocket.', { root: true });
        reject(error);
      };

      ws.onclose = () => {
        if (heartbeatHandle) {
          clearInterval(heartbeatHandle);
        }
      };
    });
  }
};

const mutations = {
  set_ws: (state, ws) => {
    state.ws = ws;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};