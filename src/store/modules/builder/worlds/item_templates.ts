import axios from "axios";
import router from "@/router";
import { generate_crud_actions } from "@/store/crud.ts";

const item_template_crud_actions = generate_crud_actions("item_template", {
  create_callback: (item_template, { rootState }) => {
    router.push({
      name: 'builder_item_template_details',
      params: {
        world_id: rootState.builder.world.id,
        item_template_id: item_template.id
      }
    });
  },
  delete_callback: ({ rootState }) => {
    router.push({
      name: 'builder_item_template_list',
      params: {
        world_id: rootState.builder.world.id
      }
    });
  }
});

export const item_template_actions = {
  ...item_template_crud_actions,

  item_template_loads_fetch: async (
    { commit },
    { world_id, item_template_id }
  ) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/itemtemplates/${item_template_id}/loadsin/`
    );
    commit("item_template_loads_set", resp.data);
    return resp.data;
    // commit("item_template_loads_set", resp.data.loaders);
    // return resp.data.loaders;
  },

  item_template_load_in_room: async (
    { commit },
    { world_id, item_template_id, room_id }
  ) => {
    const resp = await axios.post(
      `/builder/worlds/${world_id}/rooms/${room_id}/loads/`,
      { template: "item_template." + item_template_id }
    );
    commit("item_template_loads_add", resp.data);
    return resp.data;
  },

  item_template_quests_fetch: async (
    { commit },
    { world_id, item_template_id }
  ) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/itemtemplates/${item_template_id}/quests/`
    );
    commit("item_template_quests_set", resp.data.quests);
    return resp.data.quests;
  }
};

export const item_template_mutations = {
  item_template_set: (state, item_template) => {
    state.item_template = item_template;
  },

  item_template_clear: state => {
    state.item_template = null;
  },

  item_template_loads_set: (state, item_template_loads) => {
    state.item_template_loads = item_template_loads;
  },

  item_template_loads_add: (state, item_template_load) => {
    const item_template_loads = state.item_template_loads || {};

    if (!item_template_loads["loaders"]) {
      item_template_loads["loaders"] = [];
    }

    item_template_loads["loaders"].push(item_template_load);

    state.item_template_loads = item_template_loads;

    // state.item_template_loads.push(item_template_load);
  },

  item_template_quests_set: (state, quests) => {
    state.item_template_quests = quests;
  }
};
