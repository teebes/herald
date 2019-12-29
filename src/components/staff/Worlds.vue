<template>
  <ElementList
    title="Worlds"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_WORLD_INDEX } from "@/router.ts";
import ElementList from "@/components/elementlist/ElementList.vue";
import WorldView from "@/components/builder/world/WorldView.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends Vue {
  get endpoint() {
    return `/staff/worlds/`;
  }

  get resolve_route() {
    return element => {
      return {
        name: BUILDER_WORLD_INDEX,
        params: {
          world_id: element.id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "num_rooms", label: "Rooms" },
      { name: "num_players", label: "Players" },
      { name: "num_mobs", label: "Mobs" },
      { name: "num_items", label: "Items" }
    ];
  }

  onClickAdd() {
    const new_zone = {
      name: "Unnamed Zone"
    };
    const modal = {
      title: `Add Zone`,
      data: new_zone,
      schema: BUILDER_FORMS.ZONE_INFO,
      action: BUILDER_ACTIONS.ZONE_CREATE
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>