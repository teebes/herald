import axios from "axios";

const state = {
  user_reviews: [],
  unassigned_reviews: []
}

const actions = {
  load_endpoints: async ({ commit }) => {
    const user_reviews_promise = axios.get("/staff/reviews/?assigned=self");
    const unassigned_reviews_promise = axios.get("/staff/reviews/?assigned=false");
    const [
      my_reviews, unassigned_reviews
    ] = await Promise.all([user_reviews_promise, unassigned_reviews_promise]);

    commit("set_user_reviews", my_reviews.data.results);
    commit("set_unassigned_reviews", unassigned_reviews.data.results);
  },

  edit_review: async ({ dispatch }, data ) => {
    await axios.patch(`/staff/reviews/${data.id}/`, data);
    dispatch('load_endpoints');
  },

  approve_review: async ({ dispatch }, data) => {
    await axios.post(`/builder/worlds/${data.world.id}/reviews/${data.id}/resolve/`, {
      'status': 'approved',
      'text': data.text,
    });
    dispatch('load_endpoints');
  },

  reject_review: async ({ dispatch }, data) => {
    await axios.post(`/builder/worlds/${data.world.id}/reviews/${data.id}/resolve/`, {
      'status': 'reviewed',
      'text': data.text,
    });
    dispatch('load_endpoints');
  }
}

const mutations = {
  set_user_reviews: (state, reviews) => {
    state.user_reviews = reviews;
  },

  set_unassigned_reviews: (state, reviews) => {
    state.unassigned_reviews = reviews;
  },
}

export default {
  state,
  actions,
  mutations,
  namespaced: true,
}