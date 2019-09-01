import axios from "axios";
import { quest_actions, quest_mutations } from "./quests";
import { loader_actions, loader_mutations } from "./loaders";

const initial_state = () => {
  return {
    quest: null,
    loader: null
  };
};

export default {
  namespaced: true,
  state: initial_state(),
  actions: {
    ...quest_actions,
    ...loader_actions
  },
  mutations: {
    ...quest_mutations,
    ...loader_mutations
  }
};
