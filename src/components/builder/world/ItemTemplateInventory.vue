<template>
  <div>
    <h3>LOAD ITEMS</h3>
    <InColumnList :endpoint="endpoint" :schema="schema" title="Inventory Item"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { BUILDER_FORMS } from "@/core/forms.ts";
import InColumnList from "@/components/incolumnlist/List.vue";

@Component({
  components: {
    InColumnList
  }
})
export default class MerchantInventory extends Vue {
  get schema() {
    return BUILDER_FORMS.MOB_TEMPLATE_INVENTORY;
  }

  get endpoint() {
    const world_id = this.$route.params.world_id;
    const item_template_id = this.$route.params.item_template_id;
    return `builder/worlds/${world_id}/itemtemplates/${item_template_id}/inventory/`;
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>
