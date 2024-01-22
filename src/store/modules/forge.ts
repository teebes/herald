/*
  Module for interfacing with the Forge websocket.
*/

import { FORGE_WS_URI } from "@/config";

const state = {
  ws: null,
};

const actions = {
  send: async ({ commit, dispatch, state, rootState }, data) => {
    if (!state.ws) {
      await dispatch("connect");
    }
    state.ws.send(JSON.stringify(data));
  },

  receive: async ({ commit, dispatch, state, rootState }, data) => {
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

  job_complete: async ({ commit, dispatch, state, rootState }, data) => {
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
          nexus_name: data.job_data.nexus_name
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
        const error = data.error || 'Error killing world.';
        commit('ui/notification_set_error', error, { root: true });
      } else if (data.status === 'success') {
        commit('ui/notification_set', 'World killed.', { root: true });
      }
    }
  },

  pub: async ({ commit, dispatch, state, rootState }, data) => {
    const pub = data.pub;
    // builder.admin
    if (pub === 'builder.admin') {
      commit('builder/worlds/admin/world_admin_set',
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
        console.error('WebSocket Error:', error);
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