<template>
  <EditableCollection
    title="Zone Procession"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    registration_name='zone_processions'
  />
</template>

<script lang='ts' setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ZoneProcessionDetail from "./ProcessionDetails.vue";
import { FormElement } from "@/core/forms.ts";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";

const store = useStore();
const route = useRoute();

const endpoint = `/builder/worlds/${store.state.builder.world.id}/zones/${route.params.zone_id}/processions/`;
const display_component = ZoneProcessionDetail;
const schema: FormElement[] = [
  {
    attr: "room",
    label: "Room",
    widget: "reference",
    references: "room",
    context: "zone"
  },
  {
    attr: "faction",
    label: "Faction",
    widget: "reference",
    references: "faction"
  }
];
</script>
