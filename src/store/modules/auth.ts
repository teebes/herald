import { API_BASE } from "@/config";
import { AUTH_MUTATIONS } from "@/constants";
import { UI_ACTIONS } from "@/constants";
import axios from "axios";
import router from "@/router.ts";

const LOGIN_ENDPOINT = `${API_BASE}auth/login/`;
const REFRESH_ENDPOINT = `${API_BASE}auth/refresh/`;

const state = {
  token: localStorage.getItem("jwtToken") || "",
  status: "",
  user: JSON.parse(localStorage.getItem("user") || "{}")
};

const getters = {};

const actions = {
  login: async ({ commit, dispatch }, creds) => {
    try {
      const resp = await axios.post(LOGIN_ENDPOINT, creds);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
    } catch (error) {
      if (error.response.data.non_field_errors) {
        commit(
          "ui/notification_set_error",
          error.response.data.non_field_errors[0],
          {
            root: true
          }
        );
      } else {
        dispatch(UI_ACTIONS.PROCESS_ERROR_RESPONSE, error, { root: true });
      }
      localStorage.removeItem("jwtToken");
    }
  },

  logout: async ({ commit }) => {
    commit(AUTH_MUTATIONS.SET_UNAUTH);
    commit("auth_clear");
  },

  renew: async ({ commit }, token) => {
    const resp = await axios.post(REFRESH_ENDPOINT, {
      token: token
    });
    commit("auth_set", resp.data.token);
  },

  signup: async ({ commit }, payload) => {
    try {
      const resp = await axios.post("/auth/signup/", payload);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      return resp;
    } catch (error) {
      if (
        error.response.data.email &&
        error.response.data.email[0] === "This field must be unique."
      ) {
        commit("ui/notification_set_error", "Email is already registered.", {
          root: true
        });
      } else if (error.response.data.password) {
        commit("ui/notification_set_error", error.response.data.password[0], {
          root: true
        });
      }
      return Promise.reject(error);
    }
  },

  save: async ({ commit }, payload) => {
    try {
      const resp = await axios.post("auth/save/", payload);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      return resp;
    } catch (error) {
      if (
        error.response.data.email &&
        error.response.data.email[0] === "This field must be unique."
      ) {
        commit("ui/notification_set_error", "Email is already registered.", {
          root: true
        });
      } else if (error.response.data.password) {
        commit("ui/notification_set_error", error.response.data.password[0], {
          root: true
        });
      }
    }
  },

  account_save: async ({ commit }, payload) => {
    const resp = await axios.put("/user/", payload);
    commit("user_set", resp.data);
  },

  forgotpassword: async ({}, payload) => {
    const resp = await axios.post("/auth/forgotpassword/", payload);
    if (resp.status === 201) {
      return true;
    }
  },

  resetpassword: async ({ commit }, payload) => {
    try {
      const resp = await axios.post("/auth/resetpassword/", payload);
      if (resp.status === 201) {
        commit("ui/notification_set", "Password reset successfully.", {
          root: true
        });
        commit("auth_set", resp.data.token);
        commit("user_set", resp.data.user);
        router.push({ name: "lobby" });
      }
    } catch (e) {
      if (e.response.data.code) {
        commit("ui/notification_set_error", e.response.data.code[0], {
          root: true
        });
      }
    }
  },

  confirmemail: async ({ commit }, payload) => {
    try {
      const resp = await axios.post("/auth/confirmemail/", payload);
      if (resp.status === 201) {
        commit("ui/notification_set", "E-mail successfully confirmed.", {
          root: true
        });
        commit("auth_set", resp.data.token);
        commit("user_set", resp.data.user);
        router.push({ name: "lobby" });
      }
    } catch (e) {
      if (e.response.data.code) {
        commit("ui/notification_set_error", e.response.data.code[0], {
          root: true
        });
      }
    }
  }
};

const mutations = {
  auth_set: (state, token) => {
    state.status = "authenticated";
    state.token = token;
    localStorage.jwtToken = token;
  },

  auth_clear: state => {
    state.status = "unauthenticated";
    state.token = "";
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  },

  user_set: (state, user) => {
    if (user.name === null) {
      user.name = "";
    }
    state.user = user;
    localStorage.user = JSON.stringify(user);
  },

  [AUTH_MUTATIONS.SET_UNAUTH]: (state, error) => {
    state.status = "unauthenticated";
    state.token = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
