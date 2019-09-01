<template>
  <MobilePanel id="mobile-panel" />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MobilePanel from "./Panel.vue";

@Component({
  components: {
    MobilePanel
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
    margin-top: 50px;
  }
}
</style>