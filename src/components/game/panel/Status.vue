<template>
  <div class="status-region">
    <div class="player-status">
      <div class="state-region">
        <div
          class="player-state"
          :class="{ [player.state]: true, interactive: (player.state == 'standing' || player.state == 'resting')}"
          @click="onClickState"
        >{{ player_state }}</div>
      </div>
      <div class="own-effects-region">
        <ProgressBar
          v-for="effect in player_effects"
          :key="effect.expires"
          :duration="effect_duration(effect)"
          :label="effect.code"
          :expires="effect.expires"
          method="channel"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from 'vuex';
import { capfirst } from "@/core/utils";
import ProgressBar from "@/components/game/ProgressBar.vue";

const store = useStore();

const player = computed(() => store.state.game.player);
const player_effects = computed(() => store.state.game.effects[player.value.key] || []);
const player_state = computed(() => capfirst(player.value.state));
const effect_duration = (effect) => {
  const current = new Date().getTime();
  const elapsed = (current - effect.start) / 1000;
  const effect_duration = effect.duration - elapsed;
  return effect_duration;
};

const onClickState = () => {
  if (player.value.state === "standing") {
    store.dispatch("game/cmd", "rest");
  } else if (player.value.state === "resting") {
    store.dispatch("game/cmd", "stand");
  }
};
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.status-region {
  padding: 0 20px;

  .player-status {
    display: flex;
    border-bottom: 1px solid $color-background-light;
    padding: 10px 0;

    .state-region {
      margin-right: 10px;
      // Weird quirk, if we don't do this then when own effects
      // show up there is a random 2px jump in the status
      // region.
      padding: 1px 0;

      .player-state {
        @include font-title-light;
        //color: $color-text-hex-50;
        font-size: 15px;
        line-height: 18px;

        &.standing:hover,
        &.resting:hover {
          cursor: pointer;
        }

        &.combat {
          color: $color-red;
        }
      }
    }

    .own-effects-region {
      display: flex;
      flex-wrap: wrap;

      .progress-bar:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>