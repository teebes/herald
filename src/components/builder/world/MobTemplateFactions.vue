<template>
  <div id="mob_template_factions">
    <h3>MINOR FACTIONS</h3>

    <InColumnList :endpoint="endpoint" :schema="schema" title="MINOR FACTION" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import InColumnList from "@/components/incolumnlist/List.vue";
import { BUILDER_FORMS, FormElement } from "@/core/forms";

@Component({
  components: {
    InColumnList
  }
})
export default class extends Vue {
  get schema() {
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
        label: "Value",
        default: "0"
      }
    ];
    return schema;
  }

  get endpoint() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    return `builder/worlds/${world_id}/mobtemplates/${mob_template_id}/factions/?is_core=false`;
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
#mob_template_factions {
  margin-top: 30px;
}
</style>