<template>
  <div class="scroll-tool-region">
    <div class="scroll-tool-view" @click="$emit('clickScrollTool')">
      <div class="new-messages" v-if="!new_messages">JUMP TO BOTTOM</div>
      <div class="new-messages" v-else>NEW MESSAGES ({{ new_messages }})</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import EventBus from "@/core/eventbus.ts";

@Component
export default class ScrollTool extends Vue {
  new_messages: number = 0;

  mounted() {
    EventBus.$on("new-message", this.onNewMessage);
  }

  destroyed() {
    EventBus.$off("new-message", this.onNewMessage);
  }

  onNewMessage() {
    this.new_messages += 1;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.scroll-tool-region {
  width: 100%;
  position: absolute;
  bottom: 8px;
  display: flex;
  flex-direction: column-reverse;
  z-index: 100;

  .scroll-tool-view {
    display: flex;
    flex-direction: column-reverse;
    height: 50px;

    background: linear-gradient(
      to bottom,
      $color-transparent-rgba,
      $color-background-rgba 100%
    );

    .new-messages {
      &:hover {
        cursor: pointer;
      }

      border-radius: 2px;
      @include font-title-light;

      background: $color-primary;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);

      padding: 4px 8px;
      margin: 0 auto;
      font-size: 10px;
      letter-spacing: 0.5px;
      line-height: 12px;
      display: inline;
      position: relative;
      // right: 180px;

      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        position: absolute;

        border-top: 5px solid $color-primary;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        left: 49%;
        bottom: -5px;
      }
    }
  }
}
</style>