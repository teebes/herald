<template>
  <div id="mobilemenu">
    <div class="menu-item">
      <a href="https://discord.gg/a3u82tR" target="_blank">Chat on Discord</a>
    </div>
    <div class="menu-item">
      <a href="#" class="exit-game" @click.prevent="$store.dispatch('game/cmd', 'quit')">Exit World</a>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class MobileMenu extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#mobilemenu {
  border-top: 1px solid $color-background-light-border;
  position: absolute;
  background: $color-background-black;
  width: 100%;
  bottom: 60px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .menu-item {
    padding: 20px;
    width: 85%;
    text-align: center;

    &:not(:last-child) {
      border-bottom: 1px solid $color-background-light-border;
    }

    a {
      color: $color-text;
      @include font-title-light;
      font-size: 19px;
    }
  }
}
</style>