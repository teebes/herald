<template>
  <ElementList
    title="Zone Rooms"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_ROOM_INDEX } from "@/router.ts";
import ElementList from "@/components/elementlist/ElementList.vue";
import ZoneView from "@/components/builder/zone/ZoneView";

@Component({
  components: {
    ElementList
  }
})
export default class extends Mixins(ZoneView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/zones/${this.$route.params.zone_id}/rooms/`;
  }

  get resolve_route() {
    return element => {
      return {
        name: BUILDER_ROOM_INDEX,
        params: {
          world_id: this.$store.state.builder.world.id,
          room_id: element.id
        }
      };
    };
  }

  get list_schema() {
    return [{ name: "id", label: "ID" }, { name: "name", label: "Name" }];
  }
}
</script>