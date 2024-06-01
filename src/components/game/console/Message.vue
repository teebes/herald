<template>
  <div v-if="message" :class="{ echo: message.echo }">
    <div v-for="(line, index) in lines" :key="index" :class="{ echo: message.echo }">{{ line }}</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue';

const props = defineProps<{
  message: any;
}>();

const lines = computed(() => props.message.text.split("\n"));
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
.echo {
  color: $color-text-hex-50;
}
</style>
