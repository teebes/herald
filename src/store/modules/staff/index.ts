import axios from "axios";
import reviews from "./reviews";

const initial_state = () => {
  return {
    panel: null,
    user: null,
    nexus: null,
    nexus_data: null,
  }
}

export default {
  namespaced: true,
  modules: {
    reviews,
  },

  state: initial_state(),

  actions: {
    staff_panel_fetch: async ({ commit }) => {
      const resp = await axios.get("/staff/panel/");
      commit("staff_panel_set", resp.data);
    },

    staff_panel_initialize: async () => {
      await axios.post("/staff/init/");
    },

    staff_panel_teardown: async () => {
      await axios.post("/staff/teardown/");
    },

    user_fetch: async ({ commit }, user_id) => {
      const resp = await axios.get(`/staff/users/${user_id}/`);
      commit("user_set", resp.data);
    },

    invalidate: async ({ commit }, user_id) => {
      const resp = await axios.post(`/staff/users/${user_id}/invalidate/`);
      commit("user_update", resp.data);
    },

    nexus_fetch: async ({ commit }, nexus_id) => {
      const resp = await axios.get(`/staff/nexus/${nexus_id}/`);
      commit("nexus_set", resp.data);
    },

    nexus_patch: async ({ commit, state }, data) => {
      const resp = await axios.patch(`/staff/nexus/${state.nexus.id}/`, data);
      commit("nexus_set", resp.data);
    },

    nexus_data_fetch: async ({ commit }, nexus_id) => {
      const resp = await axios.get(`/staff/nexus/${nexus_id}/data/`);
      commit("nexus_data_set", resp.data);
    },
  },

  mutations: {
    staff_panel_set: (state, data) => {
      state.panel = data;
    },
    user_set: (state, data) => {
      state.user = data;
    },
    user_update: (state, data) => {
      state.user =  {...state.user, ...data};
    },
    nexus_data_set: (state, data) => {
      state.nexus_data = data;
    },
    nexus_set: (state, data) => {
      state.nexus = data;
    }
  },
};
