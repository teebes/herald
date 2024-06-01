import axios from "axios";
const initial_state = () => {
  return {
    world_admin: {
      id: null,
      multiplayer_data: {
        main_instance: null,
      },
      singleplayer_data: {
        spw_count: 0,
        live_spw_instances: [],
      },
    },

    // Instance details currently being viewed
    admin_instance: null,
  };
};

export default {
  namespaced: true,
  state: initial_state(),
  actions: {

    // World Admin actions

    world_admin_fetch: async ({ commit }, world_id) => {
      const resp = await axios.get(`/builder/worlds/${world_id}/admin/`);
      commit("world_admin_set", resp.data);
    },

    world_admin_start: async ({ commit }, world_id) => {
      const resp = await axios.post(`/builder/worlds/${world_id}/start/`);
      commit("world_admin_set", resp.data);
    },

    world_admin_stop: async ({ commit }, world_id) => {
      const resp = await axios.post(`/builder/worlds/${world_id}/stop/`);
      commit("world_admin_set", resp.data);
    },

    world_admin_kill: async ({ commit }, world_id) => {
      const resp = await axios.post(`/builder/worlds/${world_id}/kill/`);
      commit("world_admin_set", resp.data);
    },

    // World Admin Instance actions

    world_admin_instance_fetch: async ({ commit }, { world_id, instance_id }) => {
      const resp = await axios.get(`/builder/worlds/${world_id}/admin/instance/${instance_id}/`);
      commit("world_admin_instance_set", resp.data);
    },
  },
  mutations: {
    reset: state => {
      const s = initial_state();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },

    world_admin_set: (state, world_admin) => {
      state.world_admin = world_admin;
    },

    world_admin_instance_set: (state, instance) => {
      state.admin_instance = instance;
    },
  }
};
