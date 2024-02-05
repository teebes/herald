import axios from "axios";
import reviews from "./reviews";

const initial_state = () => {
  return {
    panel: null,
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

    staff_panel_initialize: async ({ commit }) => {
      const resp = await axios.post("/staff/init/");
    },

    staff_panel_teardown: async ({ commit }) => {
      const resp = await axios.post("/staff/teardown/");
    },
  },

  mutations: {
    staff_panel_set: (state, data) => {
      state.panel = data;
    },
  },
};
