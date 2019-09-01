<template>
  <ElementList
    title="Item Templates"
    :schema="list_schema"
    :filters="list_filters"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_ITEM_TEMPLATE_DETAILS } from "@/router.ts";
import WorldView from "@/components/builder/WorldView.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/itemtemplates/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_ITEM_TEMPLATE_DETAILS,
        params: {
          world_id: this.$store.state.builder.world.id,
          item_template_id: element_id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "level", label: "Level", light: true }
    ];
  }

  get list_filters() {
    return [
      {
        label: "Type",
        attr: "item_type",
        filter_options: [
          { key: "weapon_1h", name: "1H weapons" },
          { key: "weapon_2h", name: "2H weapons" },
          { key: "shield", name: "Shields" },
          { key: "head", name: "Head" },
          { key: "body", name: "Body" },
          { key: "waist", name: "Waist" },
          { key: "legs", name: "Legs" },
          { key: "feet", name: "Feet" },
          { key: "inert", name: "Inert" },
          { key: "container", name: "Containers" },
          { key: "trash", name: "Trashes" },
          { key: "quest", name: "Quest" },
          { key: "food", name: "Food" },
          { key: "key", name: "Key" }
        ]
      }
    ];
  }

  onClickAdd() {
    const new_item_template = {
      name: "a thing",
      level: 1,
      description: "",
      notes: "",
      ground_description: "",
      keywords: "",
      type: "inert",
      archetype: "warrior",
      cost: 0
    };

    const modal = {
      title: `Add Item Template`,
      data: new_item_template,
      schema: BUILDER_FORMS.ITEM_TEMPLATE_INFO,
      action: "builder/worlds/item_template_create"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>