<template>
  <div>{{ resource.name }} ({{ resource.code }})</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/world/WorldView.ts";

@Component
export default class Builder extends Mixins(WorldView) {
  @Prop() resource!: any;
}
</script>