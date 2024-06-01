import axios from "axios";
import { quest_actions, quest_mutations } from "./quests";
import { loader_actions, loader_mutations } from "./loaders";

const initial_state = () => {
  return {
    quest: null,
    loader: null,
  };
};

const zone_actions = {
  move_zone: async ({ rootState, commit }, data) => {
    const resp = await axios.post(
      `/builder/worlds/${rootState.builder.world.id}/zones/${rootState.builder.zone.id}/move/`,
      data
    );
    commit("builder/map_add", resp.data, { root: true });
  },
};

export default {
  namespaced: true,
  state: initial_state(),
  actions: {
    ...zone_actions,
    ...quest_actions,
    ...loader_actions,
  },
  mutations: {
    ...quest_mutations,
    ...loader_mutations,
  },
};
