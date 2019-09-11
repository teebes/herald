<template>
  <div>
    <EditableCollection
    title="World Faction"
    name="factions"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />    
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import WorldView from "@/components/builder/WorldView.ts";
import FactionDetail from "@/components/builder/world/FactionDetail.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/factions/`;
  }

  get display_component() {
    return FactionDetail
  }

  get schema() {
    const code: FormElement = {
      attr: "code",
      label: "Code",
    }

    const name: FormElement = {
      attr: "name",
      label: "Name",
    }

    const is_core: FormElement = {
      attr: "is_core",
      label: "Is Core",
      widget: "checkbox",
    }

    return [code, name, is_core];
  }

}
</script>