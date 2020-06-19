<template>
  <div>
    <div
      v-for="char in chars"
      :key="char.key"
      v-interactive="{ target: char, side: 'right' }"
      :class="{ hostile: isHostile(char) }"
    >
      {{ char.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Chars extends Vue {
  player: any;

  constructor() {
    super();
    this.player = this.$store.state.game.player;
  }

  get chars() {
    return this.$store.state.game.room.chars;
  }

  isHostile(char) {
    if (
      this.player.core_faction != char.core_faction &&
      char.char_type === "player"
    )
      return true;
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.hostile {
  color: $color-red;
}
</style>
