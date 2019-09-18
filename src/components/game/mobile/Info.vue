<template>
  <Tabs id="mobile-panel" @taplook="$emit('taplook')" />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Tabs from "../panel/Tabs.vue";

@Component({
  components: {
    Tabs
  }
})
export default class MobileInfo extends Vue {}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

#mobile-panel {
  background-color: $color-background-black;

  .combat-view {
    margin: 0 auto;
  }

  .inventory-view, .equipment-view {
    margin-top: auto;
  }
}
</style>