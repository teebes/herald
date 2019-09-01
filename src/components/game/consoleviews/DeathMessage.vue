<template>
  <div>
    <span v-if="!corpse.inventory.length">{{ message.text }}</span>
    <span
      class="color-secondary interactable"
      v-interactive="{target: corpse}"
      @click="onCorpseClick"
      v-else
    >{{ message.text }}</span>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getTargetInGroup } from "@/core/utils.ts";

@Component
export default class GameDeathMessage extends Vue {
  @Prop() message!: any;

  get corpse() {
    return this.message.data.corpse;
  }

  onCorpseClick() {
    let target = getTargetInGroup(
      this.corpse,
      this.$store.state.game.room.inventory
    );
    if (!target || !target.length) {
      target = "corpse";
    }
    this.$store.dispatch("game/cmd", `get all ${target}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>