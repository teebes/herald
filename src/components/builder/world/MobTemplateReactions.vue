<template>
  <div>
    <h3>REACTIONS</h3>

    <InColumnList
      class="reactions"
      :endpoint="endpoint"
      :schema="schema"
      title="REACTION"/>
  </div>
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";
import { BUILDER_FORMS } from "@/core/forms";
import InColumnList from "@/components/incolumnlist/List.vue";

const route = useRoute();

const schema = BUILDER_FORMS.MOB_TEMPLATE_REACTION;
const endpoint = `builder/worlds/${route.params.world_id}/mobtemplates/${route.params.mob_template_id}/reactions/`;
</script>