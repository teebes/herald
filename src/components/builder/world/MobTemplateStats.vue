<template>
  <div class="stats-panel">
    <h3 class="stats-heading">STATS</h3>

    <div class="use-default-stats">
      <div class="stat-group">
        <div class="checkbox">
          <input
            type="checkbox"
            id="field-default_stats"
            :checked="use_default_stats"
            @change="updateDefaultStats"
          />
          <label for="field-default_stats">Use Default Stats</label>
        </div>
        <div class="checkbox">
          <input
            type="checkbox"
            id="field-default_stats"
            :checked="is_elite"
            @change="updateIsElite"
          />
          <label for="field-default_stats">Is Elite</label>
        </div>
      </div>
    </div>

    <div class="main-stats stat-group">
      <div class="stat">
        <div class="label">Health</div>
        <div class="value">{{ template.health_max }}</div>
      </div>
      <div class="stat">
        <div class="label">Experience</div>
        <div class="value">{{ template.exp_worth }}</div>
      </div>
      <div class="stat">
        <div class="label">Mana</div>
        <div class="value">{{ template.mana_max }}</div>
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
        <div class="label">Armor</div>
        <div class="value">{{ template.armor }}</div>
      </div>
      <div class="stat">
        <div class="label">Dodge</div>
        <div class="value">{{ template.dodge }}</div>
      </div>
      <div class="stat">
        <div class="label">Resilience</div>
        <div class="value">{{ template.resilience }}</div>
      </div>
    </div>

    <div class="stats-actions" v-if="!use_default_stats">
      <button class="btn-thin" @click="editStats">EDIT STATS</button>

      <button class="btn-thin" @click="suggestStats">SUGGEST STATS</button>
    </div>
  </div>
  <!-- </div> -->
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
    return this.$store.state.builder.worlds.mob_template;
  }

  get use_default_stats() {
    return this.template.default_stats;
  }

  get is_elite() {
    return this.template.is_elite;
  }

  updateDefaultStats(event) {
    this.$store.dispatch("builder/worlds/mob_template_save", {
      default_stats: event.target.checked
    });
  }

  updateIsElite(event) {
    this.$store.dispatch("builder/worlds/mob_template_save", {
      is_elite: event.target.checked
    });
  }

  editStats() {
    const modal = {
      title: `Mob Template ${this.template.id} Stats`,
      data: this.template,
      schema: BUILDER_FORMS.MOB_TEMPLATE_STATS,
      action: "builder/worlds/mob_template_save",
      name: UI_MODALS.MOB_TEMPLATE_STATS
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async suggestStats() {
    const resp = await axios.post("builder/suggest/mob/", {
      level: this.template.level,
      archetype: this.template.archetype
    });
    const modal = {
      data: {
        ...this.template,
        ...resp.data
      },
      name: UI_MODALS.MOB_TEMPLATE_SUGGEST_STATS,
      schema: BUILDER_FORMS.MOB_TEMPLATE_STATS,
      action: "builder/worlds/mob_template_save",
      title: `Mob Template ${this.template.id} Stats`
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/builder.scss";
.use-default-stats {
  margin-bottom: 7px;
}
</style>