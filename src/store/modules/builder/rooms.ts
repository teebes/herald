import { makeCrud } from "@/store/crud.ts";
import root_store from "@/store";

export default {
  namespaced: true,
  state: {
    room: null
  },
  mutations: {
    register_check: (store, { world_id, room_id }) => {
      const endpoint = `/builder/worlds/${world_id}/rooms/${room_id}/checks/`;
      root_store.registerModule(
        ["builder", "rooms", "checks"],
        makeCrud(endpoint)
      );
    },

    unregister_check: store => {
      root_store.unregisterModule(["builder", "rooms", "checks"]);
    }
  },
  actions: {}
};
