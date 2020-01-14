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

    player_delete: async ({ commit, rootState, state }) => {
      const world_id = rootState.builder.world.id;
      const player_id = state.player.id;
      await axios.delete(`/builder/worlds/${world_id}/players/${player_id}/`);
    },

    player_reset: async ({ commit, rootState, state }) => {
      const world_id = rootState.builder.world.id;
      const player_id = state.player.id;
      const resp = await axios.post(
        `/builder/worlds/${world_id}/players/${player_id}/reset/`
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

    faction_add: async ({ commit, dispatch, rootState }, data) => {
      const resp = await dispatch("builder/factions/create", data, {
        root: true
      });
      commit("builder/faction_add", resp.data, { root: true });
    },

    faction_edit: async ({ commit, dispatch }, data) => {
      const resp = await dispatch("builder/factions/edit", data, {
        root: true
      });
      commit("builder/faction_update", resp.data, { root: true });
    },

    faction_delete: async ({ commit, dispatch, state }, data) => {
      const resp = await dispatch("builder/factions/delete", data, {
        root: true
      });
      commit("builder/faction_delete", resp.data, { root: true });
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
