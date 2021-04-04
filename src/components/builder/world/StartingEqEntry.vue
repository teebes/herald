<template>
  <div>
    <h3 class="name">
      {{ resource.num}}x {{ resource.itemtemplate.name.toUpperCase() }}
    </h3>

    <div v-if="resource.archetype">{{ capfirst(resource.archetype) }}s only.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/world/WorldView.ts";
import { capfirst } from "@/core/utils.ts"
import { BUILDER_ITEM_TEMPLATE_DETAILS } from "@/router";

@Component({
  components: {}
})
export default class extends Mixins(WorldView) {
  @Prop() resource!: any;

  capfirst = capfirst;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
}
</style>