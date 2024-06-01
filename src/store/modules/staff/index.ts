import axios from "axios";
import reviews from "./reviews";

const initial_state = () => {
  return {
    panel: null,
    user: null,
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
    }
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
    }
  },
};
