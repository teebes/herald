const set_initial_state = () => {
  return {
    world: null,
    create_character: false
  };
};

const mutations = {
  reset_state: state => {
    state = set_initial_state();
  },
  create_character_set: (state, true_or_false) => {
    state.create_character = true_or_false;
  }
};

export default {
  namespaced: true,
  state: set_initial_state(),
  mutations: mutations
};
