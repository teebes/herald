<template>
  <EditableCollection
    title="Skill"
    registration_name="skills"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    :page_size="100"
  />
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SkillDetails from "@/components/builder/world/SkillDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/skills/`;

const display_component = SkillDetails;

const schema = computed<any[]>(() => {
  const name = {
    ...BUILDER_FORMS.NAME,
  };
  const code: FormElement = {
    attr: "code",
    label: "Code",
    required: true,
  };
  const cast_time: FormElement = {
    attr: "cast_time",
    label: "Cast Time",
    default: 0,
  };
  const cooldown: FormElement = {
    attr: "cooldown",
    label: "Cooldown",
    default: 0,
  };
  const intent: FormElement = {
    attr: "intent",
    label: "Intent",
    default: "damage",
    widget: "select",
    options: [
      {
        value: "damage",
        label: "Damage",
      },
      {
        value: "healing",
        label: "Healing",
      },
      {
        value: "self_healing",
        label: "Self Healing",
      }
    ]
  }
  const cost: FormElement = {
    attr: "cost",
    label: "Cost",
    default: 0,
  };
  const cost_type: FormElement = {
    attr: "cost_type",
    label: "Cost Type",
    widget: "select",
    default: "stamina",
    options: [
      {
        value: "mana",
        label: "Mana",
      }, {
        value: "health",
        label: "Health",
      }, {
        value: "stamina",
        label: "Stamina",
      }
    ]
  };
  const cost_calc: FormElement = {
    attr: "cost_calc",
    label: "Cost Calc",
    default: "perc_base",
    options: [
      {
        value: "perc_base",
        label: "% Base",
      }, {
        value: "perc_max",
        label: "% Max",
      }, {
        value: "fixed",
        label: "Fixed",
      },
    ]
  };
  const damage: FormElement = {
    attr: "damage",
    label: "Damage",
    default: 0,
  };
  const damage_calc: FormElement = {
    attr: "damage_calc",
    label: "Damage Calc",
    widget: "select",
    default: "normal",
    options: [
      {
        value: "normal",
        label: "Normal",
      }, {
        value: "fixed",
        label: "Fixed",
      },
    ]
  };
  const damage_type: FormElement = {
    attr: "damage_type",
    label: "Damage Type",
    widget: "select",
    default: "physical",
    options: [
      {
        value: "physical",
        label: "Physical",
      }, {
        value: "magical",
        label: "Magical",
      },
    ]
  };
  const effect: FormElement = {
    attr: "effect",
    label: "Effect",
    widget: "select",
    default: "",
    options: [
      {
        value: null,
        label: "None",
      }, {
        value: "stun",
        label: "Stun",
      }, {
        value: "sleep",
        label: "Sleep",
      }, {
        value: "dot",
        label: "DOT",
      }, {
        value: "hot",
        label: "HOT",
      }, {
        value: "absorb",
        label: "Absorb",
      }
    ]
  };
  const effect_duration: FormElement = {
    attr: "effect_duration",
    label: "Effect Duration",
    default: 0,
  };
  const effect_damage: FormElement = {
    attr: "effect_damage",
    label: "Effect Damage",
    default: 0,
  };
  const effect_damage_type: FormElement = {
    attr: "effect_damage_type",
    label: "Effect Damage Type",
    widget: "select",
    default: "magical",
    options: [
      {
        value: "physical",
        label: "Physical",
      }, {
        value: "magical",
        label: "Magical",
      }
    ]
  };
  const effect_damage_calc: FormElement = {
    attr: "effect_damage_calc",
    label: "Effect Damage Calc",
    widget: "select",
    default: "normal",
    options: [
      {
        value: "normal",
        label: "Normal",
      }, {
        value: "fixed",
        label: "Fixed",
      },
    ]
  };
  const consumes: FormElement = {
    attr: "consumes",
    label: "Consumes"
  };
  const requires: FormElement = {
    attr: "requires",
    label: "Requires"
  };
  const help: FormElement = {
    attr: "help",
    label: "Help Entry"
  };

  return [
    { children: [code, name] },
    { children: [intent, cast_time, cooldown] },
    { children: [cost, cost_type, cost_calc] },
    { children: [damage, damage_type, damage_calc] },
    { children: [effect, effect_duration] },
    { children: [effect_damage, effect_damage_type, effect_damage_calc] },
    { children: [consumes, requires] },
    help,
  ];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>