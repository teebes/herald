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
        <div class="label">Max Stamina</div>
        <div class="value">{{ template.stamina_max }}</div>
      </div>
      <div class="stat">
        <div class="label">Stamina Regen</div>
        <div class="value">{{ template.stamina_regen }}</div>
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

    <div class="stat-group mt-4" v-if="template.type === 'equippable'">
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


<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();

const template = computed(() => store.state.builder.worlds.item_template);

const editStats = () => {
  const entity = template.value;
  const modal = {
    title: `Item Template ${entity.id}`,
    data: entity,
    schema: BUILDER_FORMS.ITEM_TEMPLATE_STATS,
    action: "builder/worlds/item_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};
</script>

<style lang='scss' scoped>
@import "@/styles/builder.scss";
</style>