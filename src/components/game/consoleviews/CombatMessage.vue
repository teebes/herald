<template>
  <div
    :class="{ grouped: isGrouped, damageDealt: isDamageDealt, damageTaken: isDamageTaken }"
  >{{ messageText }}</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class CombatMessage extends Vue {
  @Prop() message!: any;
  @Prop() previousMessage!: any;
  @Prop() index!: number;

  get messageText() {
    let text = this.message.text;
    if (this.message.data.is_crit_hit) {
      text = text.slice(0, text.length - 1) + "!";
    }
    return text;
  }

  get isGrouped() {
    const prevMessage = this.previousMessage;
    if (
      prevMessage &&
      prevMessage.data &&
      prevMessage.data.round_id === this.message.data.round_id
    ) {
      return false;
    }
    return true;
  }

  get isDamageTaken() {
    if (this.message.data.target.key === this.$store.state.game.player.key)
      return true;
    return false;
  }

  get isDamageDealt() {
    if (this.message.data.actor.key === this.$store.state.game.player.key)
      return true;
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.damageTaken {
  color: $color-red;
  @include font-text-regular;
}

.damageDealt {
  color: $color-green;
  @include font-text-regular;
}
</style>