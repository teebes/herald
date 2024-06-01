<template>
  <div class="w-full">
    <EditableCollection
      title="World Faction"
      name="factions"
      :endpoint="endpoint"
      :display_component="display_component"
      :schema="schema"
      action_add="builder/worlds/faction_add"
      action_edit="builder/worlds/faction_edit"
      action_delete="builder/worlds/faction_delete"
      registration_name="factions"
      :page_size="50"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import FactionDetails from "@/components/builder/world/FactionDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, DESCRIPTION } from "@/core/forms.ts";

const route = useRoute();


const endpoint = `/builder/worlds/${route.params.world_id}/factions/`;
const display_component = FactionDetails;
const schema: FormElement[] = [
  {
    attr: "code",
    label: "Code",
  },
  {
    attr: "name",
    label: "Name",
  },
  DESCRIPTION,
  {
    attr: "is_core",
    label: "Is Core",
    widget: "checkbox",
    default: true,
  },
  {
    attr: "starting_room",
    label: "Starting Room",
    widget: "reference",
    references: "room",
    help: `Only applicable for core factions.`
  },
  {
    attr: "is_default",
    label: "Is Default",
    widget: "checkbox",
    default: false,
    help: `Only applicable for core factions. If this is checked and "Can Select Core Faction" is checked in the world's advanced configuration, this faction will be the default selectable faction.`,
  },
  {
    attr: "is_selectable",
    label: "Is Selectable",
    widget: "checkbox",
    default: true,
    help: `Only applicable for core factions. Whether the faction can be selected at character creation screen. Will only be applicable if "Can Select Core Faction" is checked in the world's advanced configuration.`,
  },
];
</script>
