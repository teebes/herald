<template>
  <div id="mob_template_factions">
    <h3>MINOR FACTIONS</h3>

    <InColumnList
      :endpoint="endpoint"
      :endpoint_filters="endpoint_filters"
      :schema="schema"
      title="MINOR FACTION" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import InColumnList from "@/components/incolumnlist/List.vue";
import { FormElement } from "@/core/forms";

const route = useRoute();

const schema: FormElement[] = [
  {
    attr: "faction",
    label: "Faction",
    references: "faction",
    widget: "reference",
    context: "mob_factions"
  },
  {
    attr: "value",
    label: "Standing",
    default: "0"
  }
];

const endpoint = `builder/worlds/${route.params.world_id}/mobtemplates/${route.params.mob_template_id}/factions/`;
const endpoint_filters = { is_core: false };
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
#mob_template_factions {
  margin-top: 30px;
}
</style>