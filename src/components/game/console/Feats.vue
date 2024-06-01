<template>
  <div class="feats indented">
    <div>
      Player Feats
      <span class="color-text-50 ml-4">(Click feat to learn it)</span>
    </div>

    <table class="feats-table">
      <tbody>
        <template v-for="feat_tier in message.data.feats" class="mt-4" :key="feat_tier.tier">
          <tr class="tier-row">
            <td
              colspan="3"
              :class="{ selected: feat_tier.selected }"
              class="tier-name color-text-red"
            >
              TIER {{ feat_tier.tier }}
              <span
                v-if="!feat_tier.selected"
                class="font-text-regular ml-4"
              >(choose one)</span>
            </td>
          </tr>
          <tr
            v-for="feat in feat_tier.feats"
            :key="feat.code"
            class="feat-row"
            :class="{ tier_selected: feat_tier.selected, feat_selected: feat.selected }"
            @click="click_feat(feat.code, feat_tier.tier)"
          >
            <td class="feat-name">{{ feat.name }}</td>
            <td class="feat-description">{{ feat.description }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from "vuex";

const store = useStore();

defineProps<{
  message: any;
}>();

const click_feat = (code, tier) => {
    const player_skills = store.state.game.player.skills;
    if (
      player_skills &&
      player_skills.feat &&
      player_skills.feat[tier] &&
      player_skills.feat[tier] === code
    ) {
      return;
    }
    store.dispatch("game/cmd", `learn ${code}`);
  }
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.feats-table {
  tr.tier-row {
    > .tier-name {
      padding-top: 10px;
      padding-bottom: 5px;
      @include font-title-regular;
      color: $color-text-hex-80;
      font-size: 14px;
      letter-spacing: 1.2px;
      line-height: 15px;

      &:not(.selected) {
        color: $color-red;
      }
    }
  }

  tr.feat-row {
    &.tier_selected {
      &:not(.feat_selected) {
        color: $color-text-hex-50;
        &:hover {
          cursor: pointer;
          color: $color-primary;
        }
      }
    }

    .feat-name {
      padding: 0 10px 0 0;
    }

    // If a feat is selected, don't show it as a selectable option
    // &.tier_selected.feat_selected > .feat-code {
    //   color: inherit;
    //   cursor: default;
    // }
  }
}
</style>
