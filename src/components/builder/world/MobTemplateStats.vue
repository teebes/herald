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

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();

const template = computed(() => store.state.builder.worlds.mob_template);
const use_default_stats = computed(() => store.state.builder.worlds.mob_template.default_stats);
const is_elite = computed(() => store.state.builder.worlds.mob_template.is_elite);

const updateDefaultStats = (event) => {
  store.dispatch("builder/worlds/mob_template_save", {
    default_stats: event.target.checked
  });
};
const updateIsElite = (event) => {
  store.dispatch("builder/worlds/mob_template_save", {
    is_elite: event.target.checked
  });
};
const editStats = () => {
  const modal = {
    title: `Mob Template ${template.value.id} Stats`,
    data: template.value,
    schema: BUILDER_FORMS.MOB_TEMPLATE_STATS,
    action: "builder/worlds/mob_template_save",
    name: 'mob_template_stats'
  };
  store.commit('ui/modal/open_form', modal);
};

const suggestStats = async () => {
  const resp = await axios.post("builder/suggest/mob/", {
    level: template.value.level,
    archetype: template.value.archetype
  });
  const modal = {
    data: {
      ...template.value,
      ...resp.data
    },
    name: 'mob_template_suggest_stats',
    schema: BUILDER_FORMS.MOB_TEMPLATE_STATS,
    action: "builder/worlds/mob_template_save",
    title: `Mob Template ${template.value.id} Stats`
  };
  store.commit('ui/modal/open_form', modal);
};
</script>

<style lang='scss' scoped>
@import "@/styles/builder.scss";
.use-default-stats {
  margin-bottom: 7px;
}
</style>