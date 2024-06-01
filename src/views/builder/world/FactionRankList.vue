<template>
  <div class="w-full">
    <EditableCollection
      :title="faction_name + ' Faction Rank'"
      registration_name="faction_ranks"
      :endpoint="endpoint"
      :display_component="display_component"
      :schema="schema"
    />
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import FactionRankDetails from "@/components/builder/world/FactionRankDetails.vue";
import { FormElement } from "@/core/forms.ts";

const store = useStore();
const route = useRoute();

const faction_name = computed(() => {
  const faction_id = Number(route.params.faction_id);
  const factions = store.state.builder.world_factions;
  function getFactionNameById(factionId: number): string | null {
    const faction = factions.find(f => f.id === factionId);
    return faction ? faction.name : '';
  }
  return getFactionNameById(faction_id);
});

const endpoint = `/builder/worlds/${route.params.world_id}/factions/${route.params.faction_id}/ranks/`;
const display_component = FactionRankDetails;
const schema: FormElement[] = [
  {
    attr: "standing",
    label: "Standing"
  },
  {
    attr: "name",
    label: "Name"
  }
];
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>