<template>
  <div v-if="message" :class="{ echo: message.echo }">
    <div v-for="(line, index) in lines" :key="index" :class="{ echo: message.echo }">{{ line }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Message extends Vue {
  @Prop() message!: any;

  get lines() {
    return this.message.text.split("\n");
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
.echo {
  color: $color-text-hex-50;
}
</style>
