import axios from "axios";

export const makeCrud = (endpoint) => {
  /*
    Create a dynamic state for a resource that will be manipulated in a
    predictable manner via CRUD.
  */
  return {
    namespaced: true,
    state: {
      collection: [],
    },

    actions: {
      fetch: async ({ commit }, options) => {
        let ep = endpoint;
        if (options.page_size) {
          ep += "?page_size=" + options.page_size;
        }
        const resp = await axios.get(ep);
        let collection;
        if (resp.data.results) {
          collection = resp.data.results;
        } else if (resp.data.data) {
          collection = resp.data.data;
        } else {
          collection = resp.data;
        }
        commit("set_collection", collection);
        return resp;
      },
      create: async ({ commit }, payload) => {
        const resp = await axios.post(endpoint, payload);
        commit("add_instance", resp.data);
        return resp;
      },
      edit: async ({ commit }, payload) => {
        const resp = await axios.put(endpoint + payload.id + "/", payload);
        commit("update_instance", resp.data);
        return resp;
      },
      delete: async ({ commit }, id) => {
        if (!confirm(`Confirm deletion?`)) return;

        const resp = await axios.delete(endpoint + id + "/");
        commit("remove_instance", id);
        return resp;
      },
    },
    mutations: {
      set_collection: (state, collection) => {
        state.collection = collection;
      },
      add_instance: (state, new_instance) => {
        state.collection.push(new_instance);
      },
      update_instance: (state, new_instance) => {
        const index = state.collection.findIndex(
          (i) => i.id == new_instance.id
        );
        if (index === -1) return;
        state.collection.splice(index, 1, new_instance);
      },
      remove_instance: (state, id) => {
        const index = state.collection.findIndex((i) => i.id == id);
        if (index === -1) return;
        state.collection.splice(index, 1);
      },
    },
  };
};

export const generate_crud_actions = (
  name,
  { create_callback, delete_callback }
) => {
  /*
    Takes a name (for example mob_template or item_template) and returns a set of
    actions that can be used to fetch, create, save, and delete that resource.

    This is currently used in
  */
  const endpoint_token = name.split("_").join("") + "s";
  return {
    [`${name}_fetch`]: async ({ commit, rootState }, id) => {
      const resp = await axios.get(
        `/builder/worlds/${rootState.builder.world.id}/${endpoint_token}/${id}/`
      );
      commit(`${name}_set`, resp.data);
      return resp.data;
    },
    [`${name}_create`]: async ({ commit, rootState }, data) => {
      const resp = await axios.post(
        `builder/worlds/${rootState.builder.world.id}/${endpoint_token}/`,
        data
      );
      commit(`${name}_set`, resp.data);
      create_callback(resp.data, { rootState });
    },
    [`${name}_save`]: async ({ commit, state, rootState }, data) => {
      const resp = await axios.put(
        `/builder/worlds/${rootState.builder.world.id}/${endpoint_token}/${state[name].id}/`,
        data
      );
      commit(`${name}_set`, resp.data);
      return resp.data;
    },
    [`${name}_delete`]: async ({ commit, state, rootState }) => {
      await axios.delete(
        `/builder/worlds/${rootState.builder.world.id}/${endpoint_token}/${state[name].id}/`
      );
      commit(`${name}_clear`);
      delete_callback({ rootState });
    },
  };
};
