import axios from "axios";
import { Module } from "vuex";
import router from "@/router";
import { ActionMethods } from "@/types/vuex-types";

import { API_BASE } from "@/config";

const LOGIN_ENDPOINT = `${API_BASE}auth/login/`;
const REFRESH_ENDPOINT = `${API_BASE}auth/refresh/`;

interface State {
  token: string;
  status: string;
  user: Record<string, any>;
}

const state: State = {
  token: localStorage.getItem("jwtToken") || "",
  status: "",
  user: JSON.parse(localStorage.getItem("user") || "{}"),
};

const actions = {
  login: async ({ commit, dispatch }: ActionMethods, creds: any) => {
    try {
      const resp = await axios.post(LOGIN_ENDPOINT, creds);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
    } catch (error: any) {
      if (error.response.data.non_field_errors) {
        commit(
          "ui/notification_set_error",
          error.response.data.non_field_errors[0],
          {
            root: true
          }
        );
      } else {
        dispatch("ui/process_error_response", error, { root: true });
      }
      localStorage.removeItem("jwtToken");
    }
  },

  logout: async ({ commit }: ActionMethods) => {
    commit("auth_clear");
  },

  renew: async ({ commit }: ActionMethods, token: string) => {
    const resp = await axios.post(REFRESH_ENDPOINT, {
      token: token
    });
    commit("auth_set", resp.data.token);
  },

  signup: async ({ commit }: ActionMethods, payload: any) => {
    try {
      const resp = await axios.post("/auth/signup/", payload);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      return resp;
    } catch (error: any) {
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

  google_login: async ({ commit }: ActionMethods, credential: string) => {
    try {
      const resp = await axios.post("/auth/google/login/", { credential: credential });
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      return { success: true, resp: resp }
    } catch (error: any) {
      commit('ui/notification_set_error', 'Error logging in.')
      return { success: false, error: error}
    }
  },

  save: async ({ commit }: ActionMethods, payload: any) => {
    try {
      const resp = await axios.post("auth/save/", payload);
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      commit(
        "ui/notification_set",
        "Account saved.",
        { root: true});
      return { success: true, data: resp.data };
    } catch (error: any) {
      if (
        error.response.data.email &&
        error.response.data.email[0] === "This field must be unique."
      ) {
        commit("ui/notification_set_error", "Wrong password.", {
          root: true
        });
      } else if (error.response.data.password) {
        commit("ui/notification_set_error", error.response.data.password[0], {
          root: true
        });
      }
      return { success: false, error: error };
    }
  },

  google_save: async ({ commit }: ActionMethods, credential: string) => {
    try {
      const resp = await axios.post("/auth/google/save/", { credential: credential });
      commit("auth_set", resp.data.token);
      commit("user_set", resp.data.user);
      return { success: true, resp: resp };
    } catch (error: any) {
      commit('ui/notification_set_error', 'Error saving user.')
      return { success: false, error: error}
    };
  },

  account_save: async ({ commit }: ActionMethods, payload: any) => {
    const resp = await axios.put("/user/", payload);
    commit("user_set", resp.data);
  },

  forgotpassword: async ({}, payload: any) => {
    const resp = await axios.post("/auth/forgotpassword/", payload);
    if (resp.status === 201) {
      return true;
    }
  },

  resetpassword: async ({ commit }: ActionMethods, payload: any) => {
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
    } catch (e: any) {
      if (e.response.data.code) {
        commit("ui/notification_set_error", e.response.data.code[0], {
          root: true
        });
      }
    }
  },

  confirmemail: async ({ commit }: ActionMethods, payload: any) => {
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
    } catch (e: any) {
      if (e.response.data.code) {
        commit("ui/notification_set_error", e.response.data.code[0], {
          root: true
        });
      }
    }
  },

  resendemailconfirmation: async ({ commit }: ActionMethods, payload: any) => {
    try {
      await axios.post("/auth/resendconfirmation/", payload);
      commit("ui/notification_set", "Confirmation e-mail sent.", {
        root: true
      });
    } catch (error: any) {
      if (error.response.data.non_field_errors) {
        commit(
          "ui/notification_set_error",
          error.response.data.non_field_errors[0],
          {
            root: true
          }
        );
      }
    }
  },

  accept_code_of_conduct: async ({ commit }: ActionMethods) => {
    const resp = await axios.post("/auth/acceptcodeofconduct/", {});
    commit("user_set", resp.data);
  },

};

const mutations = {
  auth_set(state: State, token: string) {
      state.status = "authenticated";
      state.token = token;
      localStorage.setItem("jwtToken", token);
  },

  auth_clear: (state: State) => {
    state.status = "unauthenticated";
    state.token = "";
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  },

  user_set: (state: State, user: any) => {
    if (user.name === null) {
      user.name = "";
    }
    state.user = user;
    localStorage.user = JSON.stringify(user);
  },

};

const authModule: Module<State, any> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations,
}

export default authModule;