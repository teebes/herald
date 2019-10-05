<template>
  <EditableCollection
    title="World Builder"
    name="builders"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import WorldView from "@/components/builder/world/WorldView.ts";
import Builder from "@/components/builder/world/Builder.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/builders/`;
  }

  get display_component() {
    return Builder;
  }

  get schema() {
    const user: FormElement = {
      attr: "user",
      label: "User",
      widget: "reference",
      references: "user",
      context: "add_builder",
      create_only: true
    };
    const read_only: FormElement = {
      attr: "read_only",
      label: "Read Only Access",
      widget: "checkbox",
      default: true
    };
    return [user, read_only];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>