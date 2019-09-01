import axios from "axios";
import router, {
  BUILDER_ITEM_TEMPLATE_LIST,
  BUILDER_ITEM_TEMPLATE_DETAILS
} from "@/router";
import { generate_crud_actions } from "@/store/crud.ts";

const item_template_crud_actions = generate_crud_actions("item_template", {
  create_callback: (item_template, { rootState }) => {
    router.push({
      name: BUILDER_ITEM_TEMPLATE_DETAILS,
      params: {
        world_id: rootState.builder.world.id,
        item_template_id: item_template.id
      }
    });
  },
  delete_callback: ({ rootState }) => {
    router.push({
      name: BUILDER_ITEM_TEMPLATE_LIST,
      params: {
        world_id: rootState.builder.world.id
      }
    });
  }
});

export const item_template_actions = {
  ...item_template_crud_actions
};

export const item_template_mutations = {
  item_template_set: (state, item_template) => {
    state.item_template = item_template;
  },

  item_template_clear: state => {
    state.item_template = null;
  }
};
