<template>
  <div class="description-content" v-if="room.description">
    <div
      class="description-line"
      v-for="(line, index) in room.description.split('\n')"
      :key="index"
    >
      <template v-for="(word, word_index) in line.split(' ')">
        <span :key="word_index" v-if="isDetail(word)" class="interactive">{{ word }}</span>
        <span :key="word_index + 'else'" v-else>{{ word }}</span>
        {{ ' ' }}
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { Room } from "@/core/interfaces";
const props = defineProps<{
  room: Room;
}>();

const isDetail = (word: string) => {
  const trimmedWord = word.split(/\W+/)[0];
  if (!props.room.details) return false;
  for (const detail of props.room.details) {
    if (trimmedWord.toLowerCase() === detail.toLowerCase()) {
      return true;
    }
  }
  return false;
};
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";
@import "@/styles/colors.scss";
.description-content {
  .description-line {
    min-height: 14px;

    span.interactive {
      @include font-text-regular;
      border-bottom: 1px dotted #888;
      cursor: default;
    }
  }
}
</style>