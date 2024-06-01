<template>
  <div>
    <div
      v-for="char in chars"
      :key="char.key"
      v-interactive="{ target: char, side: 'right' }"
    >
    <span v-if="isHostile(char)">*</span>
    <span class="char-name" :class="{ hostile: isHostile(char) }" @click="onClickChar(char)">{{ char.name }}</span>
    <span v-if="isHostile(char)">*</span>

    <span v-if="char.target" class='color-text-50'>
      > {{ char.target.keywords.split(' ')[0] }}
    </span>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { getTargetInGroup } from "@/core/utils.ts";

const store = useStore();
const player = computed(() => store.state.game.player);
const chars = computed(() => store.state.game.room.chars);

const isHostile = (char) => {
  if (player.value.core_faction != char.core_faction && char.char_type === "player")
    return true;
  return false;
};

const onClickChar = (char) => {
  if (char.key === store.state.game.player.key) {
    return;
  }
  const target = getTargetInGroup(char, store.state.game.room.chars);
  store.dispatch("game/cmd", `look ${target}`);
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.hostile {
  color: $color-red;
}

.char-name:hover {
  color: $color-text-hex-80;
  cursor: pointer;
}
</style>
