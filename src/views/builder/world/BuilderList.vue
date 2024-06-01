<template>
  <EditableCollection
    title="World Builder"
    registration_name="builders"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <slot>
      <div
        class="color-text-50"
      >To add a builder, click 'ADD WORLD BUILDER' and look them up by e-mail address.</div>
    </slot>
  </EditableCollection>
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";
import BuilderDetails from "@/components/builder/world/BuilderDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/builders/`;
const display_component = BuilderDetails;

const schema: FormElement[] = [
  {
    attr: "user",
    label: "User",
    widget: "reference",
    references: "user",
    context: "add_builder",
    create_only: true
  },
  {
    attr: "read_only",
    label: "Read Only Access",
    widget: "checkbox",
    default: true
  }
];
</script>
