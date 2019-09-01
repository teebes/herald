<template>
  <div>
    <h3>REACTIONS</h3>

    <InColumnList class="reactions" :endpoint="endpoint" :schema="schema" title="REACTION"/>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { BUILDER_FORMS } from "@/core/forms";
import InColumnList from "@/components/incolumnlist/List.vue";

@Component({
  components: {
    InColumnList
  }
})
export default class extends Vue {

  get schema() {
    return BUILDER_FORMS.MOB_TEMPLATE_REACTION;
  }

  get endpoint() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    return `builder/worlds/${world_id}/mobtemplates/${mob_template_id}/reactions/`;
  }
}
</script>

<style lang='scss'>
// .reactions {
//   width: 300px;
// }
</style>