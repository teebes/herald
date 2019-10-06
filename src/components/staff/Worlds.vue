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
import { BUILDER_ZONE_INDEX } from "@/router.ts";
import ElementList from "@/components/elementlist/ElementList.vue";
import WorldView from "@/components/builder/world/WorldView.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import {
  BUILDER_ACTIONS,
  UI_MUTATIONS,
} from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends Mixins(WorldView) {
  get endpoint() {
    return `/staff/worlds/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_ZONE_INDEX,
        params: {
          world_id: this.$store.state.builder.world.id,
          zone_id: element_id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "num_rooms", label: "Rooms" }
    ];
  }

  onClickAdd() {
    const new_zone = {
      name: "Unnamed Zone",
    }
    const modal = {
      title: `Add Zone`,
      data: new_zone,
      schema: BUILDER_FORMS.ZONE_INFO,
      action: BUILDER_ACTIONS.ZONE_CREATE,
    }
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>