import axios from "axios";
import { mob_template_actions, mob_template_mutations } from "./mob_templates";
import {
  item_template_actions,
  item_template_mutations
} from "./item_templates";

const initial_state = () => {
  return {
    player: null,

    config: null,

    mob_template: null,
    mob_template_loads: [],
    mob_template_quests: [],

    item_template: null
  };
};

export default {
  namespaced: true,
  state: initial_state(),
  actions: {
    player_fetch: async ({ commit }, { world_id, player_id }) => {
      const resp = await axios.get(
        `/builder/worlds/${world_id}/players/${player_id}/`
      );
      commit("player_set", resp.data);
      return resp.data;
    },

    player_set: async ({ commit, rootState, state }, data) => {
      const world_id = rootState.builder.world.id;
      const player_id = state.player.id;
      const resp = await axios.put(
        `/builder/worlds/${world_id}/players/${player_id}/`,
        data
      );
      commit("player_set", resp.data);
    },

    config_fetch: async ({ commit }, { world_id }) => {
      const resp = await axios.get(`/builder/worlds/${world_id}/config/`);
      commit("config_set", resp.data);
      return resp.data;
    },

    config_save: async ({ commit, rootState }, data) => {
      const world_id = rootState.builder.world.id;
      const resp = await axios.put(`/builder/worlds/${world_id}/config/`, data);
      commit("config_set", resp.data);
      return resp.data;
    },

    ...mob_template_actions,
    ...item_template_actions
  },
  mutations: {
    reset: state => {
      const s = initial_state();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },

    player_set: (state, player) => {
      state.player = player;
    },

    config_set: (state, config) => {
      state.config = config;
    },

    config_clear: state => {
      state.config = null;
    },

    ...mob_template_mutations,
    ...item_template_mutations
  }
};
