<template>
  <div class="stats indented">
    <div
      class="summary"
    >{{ player.name }} {{ player.title }} - Level {{ player.level }} {{ core_faction_name }} {{ this.$capfirst(player.archetype) }}</div>

    <div class="columns">
      <div class="left-side">
        <div class="health stat-entry">
          <div class="label">Health</div>
          <div class="value">{{ player.health }} / {{ player.health_max }}</div>
        </div>

        <div v-if="player.archetype != 'warrior'" class="stamina stat-entry">
          <div class="label">Mana</div>
          <div class="value">{{ player.mana }} / {{ player.mana_max }}</div>
        </div>

        <div class="stamina stat-entry">
          <div class="label">Stamina</div>
          <div class="value">{{ player.stamina }} / {{ player.stamina_max }}</div>
        </div>

        <div class="constitution stat-entry">
          <div class="label">Constitution</div>
          <div class="value">{{ player.constitution }}</div>
        </div>

        <div class="strength stat-entry">
          <div class="label">Strength</div>
          <div class="value">{{ player.strength }}</div>
        </div>

        <div class="intelligence stat-entry">
          <div class="label">Intelligence</div>
          <div class="value">{{ player.intelligence }}</div>
        </div>

        <div class="dexterity stat-entry">
          <div class="label">Dexterity</div>
          <div class="value">{{ player.dexterity }}</div>
        </div>

        <div class="stat-entry">
          <div class="label">Gold</div>
          <div class="value">{{ player.gold }}</div>
        </div>

        <div class="stat-entry">
          <div class="label">Exp</div>
          <div class="value">{{ player.experience }} - {{ exp_perc_left }}%</div>
        </div>
      </div>

      <div class="right-side">
        <div class="health-regen stat-entry">
          <div class="label">Health Regen</div>
          <div class="value">{{ player.health_regen }}</div>
        </div>

        <div v-if="player.archetype != 'warrior'" class="mana-regen stat-entry">
          <div class="label">Mana Regen</div>
          <div class="value">{{ player.mana_regen }}</div>
        </div>

        <div class="ap stat-entry">
          <div class="label">Attack Power</div>
          <div class="value">{{ player.attack_power }}</div>
        </div>

        <div v-if="player.archetype != 'warrior'" class="sp stat-entry">
          <div class="label">Spell Power</div>
          <div class="value">{{ player.spell_power }}</div>
        </div>
        <div v-else class="damage stat-entry">
          <div class="label">Damage</div>
          <div class="value">{{ player.damage }}</div>
        </div>

        <div class="crit stat-entry">
          <div class="label">Crit Chance</div>
          <div class="value">{{ player.crit }} - {{ player.crit_perc }}%</div>
        </div>

        <div class="stat-entry">
          <div class="label">Armor</div>
          <div class="value">{{ player.armor }} - {{ player.armor_perc }}%</div>
        </div>

        <div class="stat-entry">
          <div class="label">Resilience</div>
          <div class="value">{{ player.resilience }} - {{ player.resilience_perc }}%</div>
        </div>

        <div class="stat-entry">
          <div class="label">Dodge</div>
          <div class="value">{{ player.dodge }} - {{ player.dodge_perc }}%</div>
        </div>

        <div class="stat-entry">
          <div class="label">Glory</div>
          <div class="value">{{ player.glory }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { capfirst } from "@/core/utils.ts"

@Component
export default class extends Vue {
  player: any = {};

  constructor() {
    super();
    this.player = this.$store.state.game.player;
  }

  get exp_perc_left() {
    return Math.round(
      (this.player.experience_progress /
        (this.player.experience_progress + this.player.experience_needed)) *
        100
    );
  }

  get core_faction_name() {
    const world_factions = this.$store.state.game.world.factions;
    if (world_factions[this.player.factions.core]) {
      return world_factions[this.player.factions.core].name;
    }
    return capfirst(this.player.factions.core);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.stats {
  font-size: 14px;

  max-width: 375px;
  display: flex;
  flex-direction: column;

  .columns {
    display: flex;

    .left-side,
    .right-side {
      flex: 1 0;
      display: flex;
      flex-direction: column;

      .stat-entry {
        display: flex;
        justify-content: space-between;

        .label {
          color: $color-text-hex-50;
        }
      }
    }

    .left-side {
      margin-right: 5px;
    }

    .right-side {
      margin-left: 5px;
    }
  }
}
</style>