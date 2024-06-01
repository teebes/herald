<template>
  <component
    :is="gameComponent"
    @input="onInput"
    :width="width"
  ></component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Desktop from "@/components/game/desktop/Desktop.vue";
import Mobile from "@/components/game/mobile/Index.vue";

const emit = defineEmits(["input"]);

const props = defineProps<{
  width: number;
}>();

const onInput = (args) => {
  emit("input", args);
}

const gameComponent = computed(() => {
    if (props.width <= 768) {
      return Mobile;
    }
    return Desktop;
  }
);
</script>

<style lang="scss">
@import "@/styles/colors.scss";
</style>