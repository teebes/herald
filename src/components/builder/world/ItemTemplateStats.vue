<template>
  <div class="stats-panel">
    <h3 class="stats-heading">STAT BONUSES</h3>

    <div class="stat-group">
      <div class="stat">
        <div class="label">Max Health</div>
        <div class="value">{{ template.health_max }}</div>
      </div>
      <div class="stat">
        <div class="label">Health Regen</div>
        <div class="value">{{ template.health_regen }}</div>
      </div>
      <div class="stat">
        <div class="label">Max Mana</div>
        <div class="value">{{ template.mana_max }}</div>
      </div>
      <div class="stat">
        <div class="label">Mana Regen</div>
        <div class="value">{{ template.mana_regen }}</div>
      </div>
      <div class="stat">
        <div class="label">Strength</div>
        <div class="value">{{ template.strength }}</div>
      </div>
      <div class="stat">
        <div class="label">Constitution</div>
        <div class="value">{{ template.constitution }}</div>
      </div>
      <div class="stat">
        <div class="label">Dexterity</div>
        <div class="value">{{ template.dexterity }}</div>
      </div>
      <div class="stat">
        <div class="label">Intelligence</div>
        <div class="value">{{ template.intelligence }}</div>
      </div>
      <div class="stat">
        <div class="label">Attack Power</div>
        <div class="value">{{ template.attack_power }}</div>
      </div>
      <div class="stat">
        <div class="label">Spell Power</div>
        <div class="value">{{ template.spell_power }}</div>
      </div>
      <div class="stat">
        <div class="label">Crit Rating</div>
        <div class="value">{{ template.crit }}</div>
      </div>
      <div class="stat">
        <div class="label">Dodge Rating</div>
        <div class="value">{{ template.dodge }}</div>
      </div>
      <div class="stat">
        <div class="label">Resilience</div>
        <div class="value">{{ template.resilience }}</div>
      </div>
    </div>

    <div class="stat-group mt-4">
      <div class="stat">
        <div class="label">Item Power</div>
        <div class="value">{{ Math.round(template.power * 100) }} %</div>
      </div>
    </div>

    <div class="stats-actions">
      <button class="btn-thin" @click="editStats">EDIT STATS</button>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BUILDER_FORMS } from "@/core/forms.ts";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MUTATIONS,
  UI_MODALS
} from "@/constants";
import axios from "axios";

@Component
export default class extends Vue {
  get template() {
    return this.$store.state.builder.worlds.item_template;
  }

  editStats() {
    const entity = this.template;
    const modal = {
      title: `Mob Template ${entity.id}`,
      data: entity,
      schema: BUILDER_FORMS.ITEM_TEMPLATE_STATS,
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/builder.scss";
</style>