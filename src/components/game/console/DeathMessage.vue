<template>
  <div>
    <span v-if="!corpse.inventory.length">{{ message.text }}</span>
    <span
      class="color-secondary interactive"
      v-interactive="{target: corpse}"
      @click="onCorpseClick"
      v-else
    >{{ message.text }}</span>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { getTargetInGroup } from "@/core/utils.ts";

const store = useStore();

const props = defineProps<{message: any}>();

const corpse = computed(() => props.message.data.corpse);

const onCorpseClick = () => {
  if (store.state.game.is_mobile) return;
  let target = getTargetInGroup(corpse, store.state.game.room.inventory);
  if (!target || !target.length) {
    target = "corpse";
  }
  store.dispatch("game/cmd", `get all ${target}`);
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>