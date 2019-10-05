import { UI_ACTIONS, UI_MUTATIONS } from "@/constants";

const state = {
  notification: "",
  notificationType: "success",
  notification_expires: 3000,
  modal: "",
  modal_data: {}, // data that can optionally be passed to the modal when invoking it,
  editingField: false
};

const getters = {};

const actions = {
  process_error_response: ({ commit }, error) => {
    if (error.response) {
      if ("non_field_errors" in error.response.data) {
        const errorMsg = error.response.data.non_field_errors;
        commit(UI_MUTATIONS.SET_NOTIFICATION_ERROR, errorMsg);
      }
    } else if (error.request) {
      commit(UI_MUTATIONS.SET_NOTIFICATION_ERROR, "Error sending request.");
    }
  }
};

const mutations = {
  editing_field_set: state => {
    state.editingField = true;
  },

  editing_field_clear: state => {
    state.editingField = false;
  },

  notification_set: (state, notification) => {
    /*
      Can be invoked either by just passing the notification stream,
      or by passing an object. If with an object, additional options
      may be specified:
      - text: the text of the notification
      - expires: how long to wait to expire the message, where a false
        value means never expire.
      - type: success or error
    */
    let expires = 3000;
    if (typeof notification === "string") {
      state.notification = notification;
      state.notificationType = "success";
    } else {
      // assume object
      state.notification = notification.text;
      if (notification.expires !== undefined) {
        expires = notification.expires;
      }
      state.notificationType = notification.type || "success";
    }
    state.notification_expires = expires;
    console.log(`set expires to: ${state.notification_expires}`);
  },

  notification_set_error: (state, notification) => {
    state.notification = notification;
    state.notificationType = "error";
    state.notification_expires = 5000;
  },

  notification_clear(state) {
    state.notification = "";
  },

  modal_set: (state, modal) => {
    state.modal = modal;
  },

  modal_clear: (state, modal) => {
    state.modal = "";
  },

  modal_set_extra_data: (state, modal_data) => {
    state.modal_data = modal_data;
  },

  clearNotification(state) {
    state.notification = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
