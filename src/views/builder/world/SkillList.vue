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
import { FormElement, BUILDER_FORMS, CONDITIONS } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/skills/`;

const display_component = SkillDetails;

const schema = computed<any[]>(() => {
  const name = {
    ...BUILDER_FORMS.NAME,
    help: `The name of the skill as it will be displayed to players. If omitted, the name will be the code with the first character capitalized.`
  };
  const code: FormElement = {
    attr: "code",
    label: "Code",
    required: true,
    help: `The code used to reference the skill within the game. This will be what players will type to learn the skill.<br/><br/>
    For example if the code for a skill is 'bash', players would use 'learn bash' to learn it or 'bash' to use it.`
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
    help: `The intent of a skill is whether it is meant to harm or help a target. This comes into play for target selection. For example if a skill has a healing intent and you use it while fighting someone, it will heal you rather than them.<br/><br/>
    Self Healing means that a skill will only target the caster.`,
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
    help: `How the cost of the skill is calculated:<br/>
    * % Base means percent of the base stat, which is the state before item bonuses.<br/>
    * % Max means percent of the stat when it is at its maximum value including item bonuses.`,
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
    help: `How much damage to inflict. If this is kept at 0, the skill will not have an attack component.`,
    default: 0,
  };
  const damage_calc: FormElement = {
    attr: "damage_calc",
    label: "Damage Calc",
    help: `How the damage is calculated.<br/>
    * Normal means the damage is calculated based on the attacker's stats.<br/>
    * Fixed means the damage is a fixed amount and does not change based on the attacker's stats.`,
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
    help: `The type of damage the skill does. Physical damage is reduced by armor and resilience, while magical damage is reduced by resilience only.`,
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
    help: `Whether to apply an effect with the skill. If this is set to None, no effect will be applied.<br/><br/>
    * Stun: stun the target, preventing them from taking action for the duration of the effect.<br/>
    * Sleep: puts the target to sleep. They will wake up if they take damage.<br/>
    * DOT: Damage Over Time. The target will take damage over the duration of the effect based on the 'Effect Damage' field.<br/>
    * HOT: Heal Over Time. The target will be healed over the duration of the effect based on the 'Effect Damage' field.<br/>
    * Absorb: Absorb incoming damage from all sources based on the 'Effect Damage' field. The higher the Effect Damage, the more damage will be absorbed.<br/>
    * Buff: Apply a buff to the target. Buffs increase stats by a given multiplier as specified in the 'Arguments' field.<br/>
    * Debuff: Apply a debuff to the target. Debuffs decrease stats by a given multiplier as specified in the 'Arguments' field.<br/>
    * Haste: Apply a haste effect to the target. Targets with haste auto-attack twice per round.<br/>
    * Stealth: Make the target enter stealth. Chars in stealth are invisible to all but keen mobs.<br/>
    * Summon: Summon the mob whose template ID is specified in the 'Arguments' field.`,
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
      }, {
        value: "buff",
        label: "Buff",
      }, {
        value: "debuff",
        label: "Debuff",
      }, {
        value: "haste",
        label: "Haste",
      }, {
        value: "summon",
        label: "Summon",
      }, {
        value: "dispel",
        label: "Dispel",
      }, {
      //   value: "invisibility",
      //   label: "Invisibility",
      // }, {
        value: "stealth",
        label: "Stealth",
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
    help: `The type of damage the effect does for DOTs or HOTs. Physical damage is reduced by armor and resilience, while magical damage is reduced by resilience only.`,
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
    help: `How the damage is calculated.<br/>
    * Normal means the damage is calculated based on the attacker's stats.<br/>
    * Fixed means the damage is a fixed amount and does not change based on the attacker's stats.`,
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
    label: "Consumes",
    help: `If the skill requires a consumable item to use, specify the item ID here. Consumable items are removed from the player's inventory when the skill is used.`
  };
  const requires: FormElement = {
    attr: "requires",
    label: "Requires",
    help: CONDITIONS.help,
  };
  const help: FormElement = {
    attr: "help",
    label: "Help Entry",
    help: `Help entry to be displayed when a player uses the 'help' command to get more information about the skill.`
  };
  const args: FormElement = {
    attr: "arguments",
    label: "Arguments",
    help: `For Buff and Debuff effects, how to modify the stats. Examples:<br/><br/>
    * Double AP: 'attack_power*2'<br/>
    * Increase AP by 10: 'attack_power+10'<br/>
    * Half SP: 'spell_power/2'<br/>
    * Decrease SP by 20: 'spell_power-20'`
  };
  const learn_condition: FormElement = {
    attr: "learn_conditions",
    label: "Learn Conditions",
    help: `The conditions that must be met in order to learn the skill. If this is left blank, the skill can be learned by any teacher willing to teach it.`
  };

  return [
    { children: [code, name] },
    { children: [intent, cast_time, cooldown] },
    { children: [cost, cost_type, cost_calc] },
    { children: [damage, damage_type, damage_calc] },
    { children: [effect, effect_duration] },
    { children: [effect_damage, effect_damage_type, effect_damage_calc] },
    { children: [args, consumes] },
    { children: [requires, learn_condition] },
    { children: [help] },
    // { children: [args, requires] },
    // { children: [consumes, help] },
  ];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>