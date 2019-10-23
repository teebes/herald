<template>
  <EditableCollection
    title="Transformation Template"
    name="transformations"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/world/WorldView.ts";
import TransformationTemplate from "@/components/builder/world/TransformationTemplate.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/transformationtemplates/`;
  }

  get display_component() {
    return TransformationTemplate;
  }

  get schema() {
    const name = {
      ...BUILDER_FORMS.NAME,
      default: "Unnamed Transformation"
    };
    const arg1: FormElement = {
      attr: "arg1",
      label: "Argument 1",
      default: ""
    };
    const arg2: FormElement = {
      attr: "arg2",
      label: "Argument 2",
      default: ""
    };
    const transformation_type: FormElement = {
      attr: "transformation_type",
      label: "Transformation Type",
      default: "attribute",
      options: [
        {
          value: "attribute",
          label: "Attribute"
        }
      ]
    };
    return [name, arg1, arg2, transformation_type];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>