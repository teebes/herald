<template>
  <div>
    <h3 class="name">
      {{ resource.name && resource.name.toUpperCase() || resource.code.toUpperCase() }}
      <span class='ml-4 '>[ <span class='color-text mx-1'>{{ resource.code }}</span> ]</span>
    </h3>
    <!-- <div>Code: {{ resource.code }}</div> -->

    <ul class='skill-features'>

    <li>{{ formatted_intent() }} skill.</li>

    <!-- Cast time & cooldown -->
    <li>
      <template v-if="resource.cast_time">{{ resource.cast_time }} sec cast time, </template>
      <template v-else>Instant cast, </template>

      <template v-if="resource.cooldown">{{ resource.cooldown }} sec cooldown.</template>
      <template v-else>no cooldown.</template>
    </li>

    <!-- Cost -->
    <li v-if="resource.cost">
      Costs
      <template v-if="resource.cost_calc == 'perc_base'">{{ resource.cost }}% of base</template>
      <template v-else-if="resource.cost_calc == 'perc_max'">{{ resource.cost }}% of max</template>
      <template v-else>{{ resource.cost }}</template>
      {{ resource.cost_type }}.
    </li>
    <li v-else>Free to cast.</li>

    <!-- Initial Damage -->
    <li v-if="resource.damage">
      <template v-if="resource.intent == 'healing' || resource.intent == 'self_healing'">
        Initially
          <template v-if="resource.intent == 'healing'">heals </template>
          <template v-else>self heals </template>
        <template v-if="resource.damage_calc == 'fixed'">
          {{ resource.damage }} health.
        </template>
        <template v-else-if="resource.damage_type == 'physical'">
          {{ resource.damage }}x attack damage worth of health.
        </template>
        <template v-else>
          {{ resource.damage }}x spell damage worth of health.
        </template>
      </template>
      <template v-else>
        Initially deals
        <template v-if="resource.damage_calc == 'fixed'">
          {{ resource.damage }} {{ resource.damage_type}} damage.
        </template>
        <template v-else-if="resource.damage_type == 'physical'">
          {{ resource.damage }}x attack damage.
        </template>
        <template v-else>
          {{ resource.damage }}x spell damage.
        </template>
      </template>
    </li>
    <li v-else>Deals no initial damage.</li>

    <!-- Effect -->
    <li v-if="resource.effect && resource.effect_duration">
      Applies effect '{{ resource.effect }}' for {{ resource.effect_duration }} secs.
    </li>

    <!-- Effect Damage -->
    <li v-if="resource.effect_damage && (resource.effect == 'dot' || resource.effect == 'hot')">
        Effect
        <!-- Dot damage -->
        <template v-if="resource.effect == 'dot'">
          deals
          <template v-if="resource.effect_damage_calc == 'fixed'">
            {{ resource.effect_damage }} {{ resource.effect_damage_type}} damage.
          </template>
          <template v-else-if="resource.effect_damage_type == 'physical'">
            {{ resource.effect_damage }}x attack damage
          </template>
          <template v-else>
            {{ resource.effect_damage }}x spell damage
          </template>
          over {{ resource.effect_duration }} secs.
        </template>
        <!-- Heal amount -->
        <template v-else>
          heals
          <template v-if="resource.effect_damage_calc == 'fixed'">
            {{ resource.effect_damage }} health
          </template>
          <template v-else-if="resource.effect_damage_type == 'physical'">
            {{ resource.effect_damage }}x attack damage worth of health
          </template>
          <template v-else>
            {{ resource.effect_damage }}x spell damage worth of health
          </template>
          over {{ resource.effect_duration }} secs.
        </template>
    </li>

    <li v-if="resource.arguments">
      Effect Arguments:
      <ul v-for="(arg, index) in resource.arguments.split(' ')" :key="index" class="ml-2">
        <!-- <li>{{ arg.split(/[:+*]/)[0] }} * {{ arg.split(/[:+*]/)[1] }}</li> -->
        <li v-if="arg.match(/^(.*?)([:+*\/\-])(.*?)$/)">
        {{ arg.match(/^(.*?)([:+*\/\-])(.*?)$/)[1] }}
        {{ arg.match(/^(.*?)([:+*\/\-])(.*?)$/)[2] }}
        {{ arg.match(/^(.*?)([:+*\/\-])(.*?)$/)[3] }}
        </li>
      </ul>
    </li>

    <!-- Consumes -->
    <li v-if="resource.consumes">
      Consumes <router-link :to="item_template_link(resource.consumes)">Item Template {{ resource.consumes }}</router-link>.
    </li>

    <!-- Requires -->
    <li v-if="resource.requires">
      Skill use requires: <span class='ml-2'>{{ resource.requires }}</span>
    </li>

    <!-- Learn Condition -->
    <li v-if="resource.learn_conditions">
      Conditions to learn the skill: <span class='ml-2'>{{ resource.learn_conditions }}</span>
    </li>

    <!-- Help -->
    <li v-if="resource.help">
      Help entry: {{ resource.help }}
    </li>

    </ul>

  </div>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { capfirst } from "@/core/utils.ts"

const route = useRoute();

const props = defineProps<{
  resource: any;
}>();

const formatted_intent = () => {
  if (props.resource.intent == 'self_healing') {
    return 'Self Healing';
  }
  return capfirst(props.resource.intent);
}

const item_template_link = (item_template_id: number) => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: route.params.world_id,
      item_template_id: item_template_id,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
}
button.add-button {
  margin-bottom: 20px;
}

.skill-features {
  margin-left: 1.5em;
}
</style>