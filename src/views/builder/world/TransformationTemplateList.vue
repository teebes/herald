<template>
  <EditableCollection
    title="Transformation Template"
    registration_name="transformations"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";
import TransformationTemplateDetails from "@/components/builder/world/TransformationTemplateDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/transformationtemplates/`;

const display_component = TransformationTemplateDetails;

const schema = [
  {
    attr: "name",
    label: "Name",
    default: "Unnamed Transformation"
  },
  {
    attr: "arg1",
    label: "Argument 1",
    default: ""
  },
  {
    attr: "arg2",
    label: "Argument 2",
    default: ""
  },
  {
    attr: "transformation_type",
    label: "Transformation Type",
    default: "attribute",
    options: [
      {
        value: "attribute",
        label: "Attribute"
      }
    ]
  }
];
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>