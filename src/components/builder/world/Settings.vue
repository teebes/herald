<template>
  <div id="world-settings">
    <h2>WORLD SETTINGS</h2>

    <h3>WORLD INFO</h3>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/WorldView.ts";

@Component
export default class WorldFrame extends Mixins(WorldView) {}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
#world-settings {
}
</style>