<template>
  <div class='effect' :class="{ friendly: isFriendly, hostile: isHostile}">
    <div v-if="$store.state.game.player_config.combat_brief" class='brief flex'>

      <div class='effect-code flex-grow'>
        {{ message.data.code }} &mdash; 
        <span v-if="message.data.target === player_key">effect start</span>
        <span v-else>{{ message.data.target_data.keyword }} effect start</span>
      </div>
      <div class='duration nowrap mr-2'>{{ message.data.duration}} sec</div>
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

  player_id: number;
  player_key: string;

  constructor() {
    super();
    this.player_id = this.$store.state.game.player_id;
    this.player_key = `player.${this.player_id}`;
  }

  get isFriendly() {
    return (
      this.message.data.friendly && this.message.data.target === this.player_key
    );
  }

  get isHostile() {
    return (
      !this.message.data.friendly &&
      this.message.data.target === this.player_key
    );
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.effect {
  &.friendly {
    color: $color-green;
    @include font-text-regular;
    .brief {
      color: $color-green !important;
    }
  }

  &.hostile {
    color: $color-red;
    @include font-text-regular;
    .brief {
      color: $color-red !important;
    }
  }
}
</style>