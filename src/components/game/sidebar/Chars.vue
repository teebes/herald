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

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getTargetInGroup } from "@/core/utils.ts";

@Component
export default class Chars extends Vue {
  player: any;

  constructor() {
    super();
    this.player = this.$store.state.game.player;
  }

  get chars() {
    return this.$store.state.game.room_chars;
  }

  isHostile(char) {
    if (
      this.player.core_faction != char.core_faction &&
      char.char_type === "player"
    )
      return true;
    return false;
  }

  onClickChar(char) {
    if (char.key === this.$store.state.game.player.key) {
      return;
    }
    const target = getTargetInGroup(char, this.$store.state.game.room.chars);
    this.$store.dispatch("game/cmd", `look ${target}`);
  }
}
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
