<template>
  <Tabs id="mobile-panel" @taplook="emit('taplook')" />
</template>

<script lang='ts' setup>
import Tabs from "@/components/game/panel/Tabs.vue";
const emit = defineEmits(["taplook"]);
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

#mobile-panel {
  background-color: $color-background-black;
  padding-bottom: 10px;

  .combat-view {
    margin: 0 auto;
  }

  .inventory-view,
  .equipment-view {
    margin-top: auto;
  }
}
</style>