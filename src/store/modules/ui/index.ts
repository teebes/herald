import modal from '@/store/modules/ui/modal.ts';

const state = {
  notification: "",
  notificationType: "success",
  notification_expires: 3000,
  editingField: false,
};


const getters = {};

const actions = {
  process_error_response: ({ commit }, error) => {
    if (error.response) {
      if ("non_field_errors" in error.response.data) {
        const errorMsg = error.response.data.non_field_errors;
        commit('notification_set_error', errorMsg);
      }
    } else if (error.request) {
      commit('notification_set_error', "Error sending request.");
    }
  },
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
      // { text: text, expires: expires, type: type } being passed in
      state.notification = notification.text;
      if (notification.expires !== undefined) {
        expires = notification.expires;
      }
      state.notificationType = notification.type || "success";
    }
    state.notification_expires = expires;
  },

  notification_set_error: (state, notification) => {
    state.notification = notification;
    state.notificationType = "error";
    state.notification_expires = 5000;
  },

  notification_clear(state) {
    state.notification = "";
  },

  clearNotification(state) {
    state.notification = "";
  },

};

export default {
  state,
  getters,
  actions,
  mutations,
  modules: { modal },
  namespaced: true
};
