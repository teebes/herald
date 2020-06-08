<template>
  <div class='effect' :class="{ friendly: message.data.friendly, hostile: !message.data.friendly}">
    <div v-if="$store.state.game.player_config.combat_brief" class='brief flex'>

      <div class='effect-code'>[ {{ message.data.code }} ]</div>
      <div class='effect-summary flex-grow text-center'>effect start</div>
      <div class='duration mr-2'>{{ message.data.duration}} sec</div>
    </div>
    <div class='effect' v-else>
        {{ message.text }}
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class EffectMessage extends Vue {
  @Prop() message!: any;
  @Prop() previousMessage!: any;
  @Prop() index!: number;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.effect {
  &.friendly {
    color: $color-green;
    @include font-text-regular;
  }

  &.hostile {
    color: $color-red;
    @include font-text-regular;
  }
}
</style>