<template>
  <EditableCollection
    title="Starting EQ"
    registration_name="starting_eq"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StartingEqDetails from "@/components/builder/world/StartingEqDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/startingeq/`;

const display_component = StartingEqDetails;

const schema = computed(() => {
  /*
  - itemtemplate
  - archetype
  - num
  */
  const num: FormElement = {
    attr: "num",
    label: "Number of Copies"
  };
  const archetype: FormElement = {
    attr: "archetype",
    label: "Archetype",
    widget: "select",
    default: null,
    options: [
      {
        value: null,
        label: "All"
      },
      {
        value: "warrior",
        label: "Warrior",
      },
      {
        value: "mage",
        label: "Mage",
      },
      {
        value: "cleric",
        label: "Cleric",
      },
      {
        value: "assassin",
        label: "Assassin",
      },
    ],
  };
  const item_template: FormElement = {
    ...BUILDER_FORMS.ITEM_TEMPLATE,
    attr: 'itemtemplate',
  };

  return [item_template, num, archetype];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>