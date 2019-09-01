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
    return BUILDER_FORMS.MOB_TEMPLATE_MERCHANT_INVENTORY;
  }

  get endpoint() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    return `builder/worlds/${world_id}/mobtemplates/${mob_template_id}/merchantinventory/`;
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>
