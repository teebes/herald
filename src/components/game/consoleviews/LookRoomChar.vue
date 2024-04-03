<template>
  <div class="inline-block" @click="handleClick">
    <template v-if="char.target">
      <span :class="{ hostile: isHostile }">{{ capfirst(char.name) }}</span>
      is here, fighting
      <span v-if="targetsYou">YOU!</span>
      <template v-else>
        <span v-if="isHostile">*</span><span :class="{ hostile: isHostile }">{{ char.target.name }}</span><span
          v-if="isHostile">*</span>
        .
      </template>
    </template>

    <template v-else-if="isHostile">
      <span v-if="isHostile">*</span><span :class="{ hostile: isHostile }">{{ capfirst(char.name) }}</span><span
        v-if="isHostile">*</span>
      is here.
    </template>

    <span v-else>{{ char.room_description }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { capfirst } from "@/core/utils.ts";

/*
  When fighting, want to just show name + fighting target / you
  When not fighting, if not hostile should show room desc
    if hostile, show
*/

@Component
export default class LookRoomChar extends Vue {
  @Prop() char!: any;

  player: any;

  capfirst = capfirst;

  constructor() {
    super();
    this.player = this.$store.state.game.player;
  }

  get isHostile() {
    if (
      this.player.core_faction != this.char.core_faction &&
      this.char.char_type === "player"
    )
      return true;
    return false;
  }

  get targetsYou() {
    if (this.char.target && this.char.target.key == this.player.key)
      return true;
    return false;
  }

  handleClick() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.hostile {
  color: $color-red;
}
</style>
