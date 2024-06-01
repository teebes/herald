<template>
  <div>
    <h3>ITEM INVENTORY</h3>
    <InColumnList :endpoint="endpoint" :schema="schema" title="Inventory Item" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { BUILDER_FORMS } from "@/core/forms.ts";
import InColumnList from "@/components/incolumnlist/List.vue";

const route = useRoute();

const schema = BUILDER_FORMS.MOB_TEMPLATE_INVENTORY;
const endpoint = `builder/worlds/${route.params.world_id}/itemtemplates/${route.params.item_template_id}/inventory/`;
</script>