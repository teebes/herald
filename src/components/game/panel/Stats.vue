<template>
  <div>
    <template v-if="game.is_mobile">
      <Summary />
      <img class="game-divider my-2" src="@/assets/ui/divider.svg" />
    </template>

    <div class="stats-view">
      <div class="stats-group">
        <div class="label">Stats</div>
        <div class="stats">
          <div class="stat">
            <div class="st-label">Strength</div>
            <div class="st-value">{{ player.strength }}</div>
          </div>
          <div class="stat">
            <div class="st-label">Intelligence</div>
            <div class="st-value">{{ player.intelligence }}</div>
          </div>
          <div class="stat">
            <div class="st-label">Constitution</div>
            <div class="st-value">{{ player.constitution }}</div>
          </div>
          <div class="stat">
            <div class="st-label">Dexterity</div>
            <div class="st-value">{{ player.dexterity }}</div>
          </div>
        </div>
      </div>

      <div class="stats-group">
        <div class="label">Attributes</div>
        <div class="stats">
          <div class="stat">
            <div class="st-label">Attack Power</div>
            <div class="st-value">{{ player.attack_power }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Spell Power</div>
            <div class="st-value">{{ player.spell_power }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Damage</div>
            <div class="st-value">{{ player.damage }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Crit Chance</div>
            <div class="st-value">{{ player.crit_perc }}%</div>
          </div>

          <div class="stat">
            <div class="st-label">Health Regen</div>
            <div class="st-value">{{ player.health_regen }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Mana Regen</div>
            <div class="st-value">{{ player.mana_regen }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Stamina Regen</div>
            <div class="st-value">{{ player.stamina_regen }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Armor</div>
            <div class="st-value">{{ player.armor_perc }}%</div>
          </div>

          <div class="stat">
            <div class="st-label">Resilience</div>
            <div class="st-value">{{ player.resilience_perc }}%</div>
          </div>

          <div class="stat">
            <div class="st-label">Dodge</div>
            <div class="st-value">{{ player.dodge_perc }}%</div>
          </div>

          <div class="stat">
            <div class="st-label"></div>
            <div class="st-value"></div>
          </div>
        </div>
      </div>

      <div class="stats-group">
        <div class="label">Other</div>
        <div class="stats">
          <div class="stat">
            <div class="st-label">Exp</div>
            <div class="st-value">{{ player.experience }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Gold</div>
            <div class="st-value">{{ player.gold }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Glory</div>
            <div class="st-value">{{ player.glory }}</div>
          </div>

          <div class="stat">
            <div class="st-label">Medals</div>
            <div class="st-value">{{ player.medals }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from 'vuex';
import Summary from "@/components/game/panel/Summary.vue";

const store = useStore();

const player = computed(() => store.state.game.player);
const game = computed(() => store.state.game);
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.stats-view {
  padding: 0 20px;
  .stats {
    display: flex;
    flex-wrap: wrap;
    .stat {
      flex: 1 1 50%;
      display: flex;
      justify-content: space-between;

      &:nth-child(odd) {
        padding-right: 5px;
      }
      &:nth-child(even) {
        padding-left: 5px;
      }

      .st-label {
        color: $color-text-hex-50;
      }
    }
  }

  .stats-group {
    &:not(:first-child) {
      margin-top: 12px;
    }

    .label {
      @include font-title-light;
      color: $color-secondary;
      font-size: 15px;
      line-height: 18px;
    }
  }
}
</style>