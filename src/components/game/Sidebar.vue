<template>
  <div id="sidebar">Sidebar component</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#sidebar {
  background: $color-background-light;
  border-left: 2px solid $color-background-very-light;
  width: 250px;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 15px;
}
</style>
