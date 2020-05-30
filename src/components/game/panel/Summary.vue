<template>
  <div class="summary-region">
    <div>
      <div class="name-and-summary">
        <div class="name" :title="{ [player.title]: player.title }">{{ player.name }}</div>
        <div class="summary"><span v-if="$store.state.game.world.allow_combat">{{ archetype }} level {{ player.level }}</span><span v-else>&nbsp;</span></div>
      </div>
      <div class="experience">
        <div class="exp-gained" :style="{width: expPerc +'%'}"></div>
      </div>
    </div>
  </div>
</template>

<script type='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { capitalize } from "@/core/utils.ts";

@Component
export default class PanelSummary extends Vue {
  get player() {
    return this.$store.state.game.player;
  }

  get archetype() {
    return capitalize(this.player.archetype);
  }

  get expPerc() {
    const needed = this.player.experience_needed,
      progress = this.player.experience_progress;
    return (progress / (needed + progress)) * 100;
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

.summary-region {
  padding: 5px 20px 15px 20px;

  .name-and-summary {
    display: flex;

    .name {
      font-size: 14px;
      line-height: 19px;
      flex-grow: 1;
    }

    .summary {
      color: $color-text-hex-50;
    }
  }

  .experience {
    background: #333;
    border-radius: 3px;
    height: 3px;
    width: 100%;

    .exp-gained {
      background: $color-secondary;
      height: 100%;
      width: 0%;
      border-radius: 3px;
    }
  }
}
</style>