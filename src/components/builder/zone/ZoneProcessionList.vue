<template>
  <EditableCollection
    title="Zone Procession"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import ZoneProcessionDetail from "./ZoneProcessionDetail.vue";
import { FormElement } from "@/core/forms.ts";
import EditableCollection from "@/components/EditableCollection.vue";

@Component({
  components: {
    EditableCollection
  }
})
export default class ZoneProcessionList extends Mixins(ZoneView) {
  get endpoint() {
    return `/builder/worlds/${this.$store.state.builder.world.id}/zones/${this.$route.params.zone_id}/processions/`;
  }

  get display_component() {
    return ZoneProcessionDetail;
  }

  get schema() {
    const room: FormElement = {
      attr: "room",
      label: "Room",
      widget: "reference",
      references: "room",
      context: "zone"
    };
    const faction: FormElement = {
      attr: "faction",
      label: "Faction",
      widget: "reference",
      references: "faction"
    };
    return [room, faction];
  }
}
</script>
