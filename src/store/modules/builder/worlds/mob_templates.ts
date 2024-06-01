import axios from "axios";
import router from "@/router";
import { generate_crud_actions } from "@/store/crud.ts";

export const mob_template_crud_actions = generate_crud_actions("mob_template", {
  create_callback: (mob_template, { rootState }) => {
    router.push({
      name: 'builder_mob_template_details',
      params: {
        world_id: rootState.builder.world.id,
        mob_template_id: mob_template.id
      }
    });
  },
  delete_callback: ({ rootState }) => {
    router.push({
      name: 'builder_mob_template_list',
      params: {
        world_id: rootState.builder.world.id
      }
    });
  }
});

export const mob_template_actions = {
  ...mob_template_crud_actions,

  mob_template_loads_fetch: async (
    { commit },
    { world_id, mob_template_id }
  ) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/mobtemplates/${mob_template_id}/loadsin/`
    );
    commit("mob_template_loads_set", resp.data.loaders);
    return resp.data.loaders;
  },

  mob_template_load_in_room: async (
    { commit },
    { world_id, mob_template_id, room_id }
  ) => {
    const resp = await axios.post(
      `/builder/worlds/${world_id}/rooms/${room_id}/loads/`,
      { template: "mob_template." + mob_template_id }
    );
    commit("mob_template_loads_add", resp.data);
    return resp.data;
  },

  mob_template_quests_fetch: async (
    { commit },
    { world_id, mob_template_id }
  ) => {
    const resp = await axios.get(
      `/builder/worlds/${world_id}/mobtemplates/${mob_template_id}/quests/`
    );
    commit("mob_template_quests_set", resp.data.quests);
    return resp.data.quests;
  }
};

export const mob_template_mutations = {
  mob_template_loads_set: (state, mob_template_loads) => {
    state.mob_template_loads = mob_template_loads;
  },

  mob_template_loads_add: (state, mob_template_load) => {
    state.mob_template_loads.push(mob_template_load);
  },

  mob_template_set: (state, mob_template) => {
    state.mob_template = mob_template;
  },

  mob_template_clear: state => {
    state.mob_template = null;
  },

  mob_template_quests_set: (state, quests) => {
    state.mob_template_quests = quests;
  }
};
