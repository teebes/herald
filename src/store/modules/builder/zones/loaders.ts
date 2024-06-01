import router from "@/router";
import { generate_crud_actions } from "@/store/crud.ts";

export const loader_actions = generate_crud_actions("loader", {
  create_callback: (loader, { rootState }) => {
    router.push({
      name: 'builder_zone_loader_details',
      params: {
        world_id: rootState.builder.world.id,
        loader_id: loader.id
      }
    });
  },

  delete_callback: ({ rootState }) => {
    router.push({
      name: 'builder_zone_loader_list',
      params: {
        world_id: rootState.builder.world.id
      }
    });
  }
});

export const loader_mutations = {
  loader_set: (state, loader) => {
    state.loader = loader;
  },
  loader_clear: state => {
    state.loader = null;
  }
};
