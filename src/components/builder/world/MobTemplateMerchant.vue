<template>
  <div>
    <h3>MERCHANT INVENTORY</h3>

    <InColumnList
      class="merchant"
      :endpoint="endpoint"
      :schema="schema"
      title="MERCHANT INVENTORY"/>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { BUILDER_FORMS } from "@/core/forms.ts";
import InColumnList from "@/components/incolumnlist/List.vue";

const route = useRoute();

const schema = BUILDER_FORMS.MOB_TEMPLATE_MERCHANT_INVENTORY;
const endpoint = `builder/worlds/${route.params.world_id}/mobtemplates/${route.params.mob_template_id}/merchantinventory/`;
</script>
