import axios from "axios";
import {
  mob_template_actions,
  mob_template_mutations
} from "./mob_templates";
import {
  item_template_actions,
  item_template_mutations
} from "./item_templates";
import admin from "./admin";

const initial_state = () => {
  return {
    // Used for player details screen
    player: null,

    // Used for the World Config screen
    config: null,

    mob_template: null,
    mob_template_loads: [],
    mob_template_quests: [],

    item_template: null,
    item_template_quests: [],
    item_template_loads: [],

    instances: [],
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

    player_delete: async ({ rootState, state }) => {
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

    player_restore: async ({ commit, rootState, state }) => {
      const world_id = rootState.builder.world.id;
      const player_id = state.player.id;
      const resp = await axios.post(
        `/builder/worlds/${world_id}/players/${player_id}/restore/`
      );
      commit("player_set", resp.data);
      commit("ui/notification_set", "Player data restored.", { root: true });
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

    config_patch: async ({ commit, rootState }, data) => {
      const world_id = rootState.builder.world.id;
      const resp = await axios.patch(`/builder/worlds/${world_id}/config/`, data);
      commit("config_set", resp.data);
      return resp.data;
    },

    submit_world_for_review: async ({ commit, rootState }, data) => {
      const world_id = rootState.builder.world.id;
      const resp = await axios.post(
        `/builder/worlds/${world_id}/reviews/`,
        {description: data.description}
      );
      if (resp.status, 201) {
        const world = rootState.builder.world;
        const review = {
          'status': resp.data['status'],
          'text': resp.data['text'],
          'reviewer': resp.data['reviewer'],
          'description': resp.data['description']
        }
        world.review = review;
        commit("builder/world_set", world, { root: true });
      }
    },

    faction_add: async ({ commit, dispatch }, data) => {
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

    faction_delete: async ({ commit, dispatch }, data) => {
      const resp = await dispatch("builder/factions/delete", data, {
        root: true
      });
      commit("builder/faction_delete", resp.data, { root: true });
    },

    instances_fetch: async ({ commit }, { world_id }) => {
      const resp = await axios.get(`/builder/worlds/${world_id}/instances/`);
      commit("instances_set", resp.data.results);
      return resp.data['results'];
    },

    instance_create: async ({ commit, rootState }, payload) => {
      payload.instance_of = rootState.builder.world.id;
      const resp = await axios.post(`/builder/worlds/`, payload);

      if (resp.status === 201) {
        commit("ui/notification_set", "Instance created.", { root: true });
        commit("instance_add", resp.data)
      }
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

    instances_set: (state, instances) => {
      state.instances = instances;
    },

    instance_add: (state, instance) => {
      state.instances.unshift(instance);
    },

    ...mob_template_mutations,
    ...item_template_mutations
  },
  modules: {
    admin,
  }
};
