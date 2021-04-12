<template>
  <div v-if="message" :class="{ echo: message.echo }">
    <div v-for="(line, index) in lines" :key="index" :class="{ echo: message.echo, builder: message.data.is_builder }"> 
      <span v-if="message.data.is_builder" class="mr-2">[ Builder ]</span>
      <span v-if="message.data.is_builder && message.data.faction" class="mr-2">[ {{ message.data.faction }} ]</span>
      <span v-if="$store.state.game.player.is_immortal && message.data.player && message.data.player.core_faction">[ {{ message.data.player.core_faction }} ]</span>
      {{ line }}
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Chat extends Vue {
  @Prop() message!: any;

  get lines() {
    return this.message.text.split("\n");
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.echo {
  color: $color-text-hex-50;
}
.builder {
  color: $color-primary;
  @include font-text-regular;
}
</style>
