<template>
  <div class="description-content" v-if="room.description">
    <div
      class="description-line"
      v-for="(line, index) in room.description.split('\n')"
      :key="index"
    >
      <template v-for="(word, word_index) in line.split(' ')">
        <span :key="word_index" v-if="isDetail(word)" class="interactable">{{ word }}</span>
        <span :key="word_index" v-else>{{ word }}</span>
        {{ ' ' }}
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class RoomDescription extends Vue {
  @Prop() room!: any;

  isDetail(word) {
    const trimmedWord = word.split(/\W+/)[0];
    if (!this.room.details) return false;
    for (const detail of this.room.details) {
      if (trimmedWord.toLowerCase() === detail.toLowerCase()) return true;
    }
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.description-content {
  .description-line {
    min-height: 14px;

    span.interactable {
      cursor: default;
    }
  }
}
</style>