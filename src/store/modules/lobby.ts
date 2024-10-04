import axios from "axios";
import _ from "lodash";

const set_initial_state = () => {
  return {
    world: null,
    chars: null,
    leaders: null,

    create_character: false,

    // For char editing and deleting, set by the view before invoking the action
    char_id: Number,
  };
};

const actions = {
  initial_fetch: async ({ commit }, world_id) => {
    commit('reset_state');

    const worldFetchPromise = axios.get(
      `/lobby/worlds/${world_id}/`
    );

    const userCharsPromise = axios.get(
      `/lobby/worlds/${world_id}/chars/?page_size=30`
    );

    const leaderboardPromise = axios.get(
      `/lobby/worlds/${world_id}/leaders/`
    );

    const [world_resp, user_chars_resp, leaderboard_resp] = await Promise.all([
      worldFetchPromise,
      userCharsPromise,
      leaderboardPromise,
    ]);

    commit('set_chars', user_chars_resp.data.results);
    commit('set_world', world_resp.data);
    commit('set_leaders', leaderboard_resp.data.results)
  },
  char_edit: async ({ commit, state }, payload) => {
    const world_id = state.world.id;
    const char_id = state.char_id;
    const resp = await axios.patch(`/lobby/worlds/${world_id}/chars/${char_id}/`, {
      description: payload.description
    });
    commit('char_update', resp.data);
  },
  char_delete: async ({ commit, state }) => {
    const world_id = state.world.id;
    const char_id = state.char_id;
    await axios.delete(`/lobby/worlds/${world_id}/chars/${char_id}/`);
    commit('char_delete', char_id);
  }
};

const mutations = {
  reset_state: (state) => {
    Object.assign(state, set_initial_state());
  },
  create_character_set: (state, true_or_false) => {
    state.create_character = true_or_false;
  },
  set_chars: (state, chars) => {
    state.chars = chars;
  },
  char_create: (state, char) => {
    state.chars.splice(0, 0, char);
  },
  char_update: (state, char) => {
    const char_ids = _.map(state.chars, char => char.id);
    const index = char_ids.indexOf(char.id);
    state.chars.splice(index, 1, char);
  },
  char_delete: (state, char_id) => {
    const char_ids = _.map(state.chars, char => char.id);
    const index = char_ids.indexOf(char_id);
    state.chars.splice(index, 1);
  },
  char_id_set: (state, id) => {
    state.char_id = id;
  },
  char_id_clear: (state) => {
    state.char_id = null;
  },
  set_world: (state, world) => {
    state.world = world;
  },
  set_leaders: (state, leaders) => {
    state.leaders = leaders;
  }
};

export default {
  namespaced: true,
  state: set_initial_state(),
  actions,
  mutations: mutations
};
