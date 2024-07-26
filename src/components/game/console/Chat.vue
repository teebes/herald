<template>
  <div v-if="message" :class="{ echo: message.echo }">
    <div v-for="(line, index) in lines" :key="index" :class="{ echo: message.echo, builder: message.data.is_builder }">
      <span v-if="message.data.is_builder" class="mr-2">[ Builder ]</span>
      <span v-if="message.data.is_builder && message.data.faction" class="mr-2">[ {{ message.data.faction }} ]</span>
      <span v-if="store.state.game.player.is_immortal && message.data.player && message.data.player.core_faction" class="mr-2">[ {{ message.data.player.core_faction }} ]</span>
      <span class="line" v-html="line"></span>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { parseLinks } from "@/core/utils";

const store = useStore();

const props = defineProps<{
  message: any;
}>();

const lines = computed(() => {
  return props.message.text.split("\n").map(l => parseLinks(l));
});
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
.line ::v-deep {
  a {
    color: $color-text-70;

    &:hover {
      color: $color-text;
      text-decoration: none;
      border-bottom-color: #aaa;
      cursor: pointer;
    }
  }
}
</style>
