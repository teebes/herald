<template>
  <div id="mob_template_factions">
    <h3>FACTIONS</h3>

    <InColumnList :endpoint="endpoint" :schema="schema" title="FACTION RELATIONSHIP"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import InColumnList from "@/components/incolumnlist/List.vue";
import { BUILDER_FORMS } from "@/core/forms";

@Component({
  components: {
    InColumnList
  }
})
export default class extends Vue {
  get schema() {
    return BUILDER_FORMS.MOB_TEMPLATE_FACTION;
  }

  get endpoint() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    return `builder/worlds/${world_id}/mobtemplates/${mob_template_id}/factions/`;
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
#mob_template_factions {
  margin-top: 30px;
}
</style>