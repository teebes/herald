import axios from "axios";

const initial_state = () => {
  return {
    player: null,

    mob_template: null,
    mob_template_loads: [],
  }
}

const mob_template_actions = {

  mob_template_fetch: async({ commit }, { world_id, mob_template_id }) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/mobtemplates/${mob_template_id}`
    )
    commit("mob_template_set", resp.data)
    return resp.data;
  },

  mob_template_loads_fetch: async({ commit }, { world_id, mob_template_id }) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/mobtemplates/${mob_template_id}/loadsin/`
    )
    commit("mob_template_loads_set", resp.data.loaders)
    return resp.data.loaders;
  },    

  mob_template_save: async({ commit }, { world_id, mob_template_id }) => {
    const resp = await axios.put(
      `/builder/worlds/${world_id}/mobtemplates/`
    );
  }
}

export default {
  namespaced: true,
  state: initial_state(),
  actions: {

    fetch_player: async ({ commit }, { world_id, player_id }) => {
      const resp = await axios.get(
        `/builder/worlds/${world_id}/players/${player_id}/`
      );
      commit("set_player", resp.data);
      return resp.data;
    },

    ...mob_template_actions,

  },
  mutations: {
    reset: (state) => {
      const s = initial_state();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },

    set_player: (state, player) => {
      state.player = player;
    },

    mob_template_loads_set: (state, mob_template_loads) => {
      state.mob_template_loads = mob_template_loads
    },

    mob_template_set: (state, mob_template) => {
      state.mob_template = mob_template;
    }
  }
};
