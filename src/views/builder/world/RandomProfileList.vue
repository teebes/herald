<template>
  <EditableCollection
    title="Random Item Profile"
    registration_name="random_profiles"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from "vue-router";
import RandomItemProfile from "@/components/builder/world/RandomProfileDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/randomitemprofiles/`;
const display_component = RandomItemProfile;
const schema = computed(() => {
  const name = {
    ...BUILDER_FORMS.NAME,
    default: "Unnamed Profile"
  };
  const level: FormElement = {
    attr: "level",
    label: "Level",
    default: 20
  };
  const chance_imbued: FormElement = {
    attr: "chance_imbued",
    label: "Chance Imbued",
    default: 100
  };
  const chance_enchanted: FormElement = {
    attr: "chance_enchanted",
    label: "Chance Enchanted",
    default: 25
  };
  const restriction: FormElement = {
    attr: "restriction",
    label: "Restriction",
    default: "",
    options: [
      {
        value: "",
        label: "All"
      },
      {
        value: "armor_only",
        label: "Armor Only"
      },
      {
        value: "weapon_only",
        label: "Weapon Only"
      },
      {
        value: "weapon_1h_only",
        label: "Weapon 1H Only"
      },
      {
        value: "weapon_2h_only",
        label: "Weapon 2H Only"
      },
      {
        value: "shield_only",
        label: "Shield Only"
      },
      {
        value: "weapon_or_shield",
        label: "Weapon or Shield"
      },
      {
        value: "armor_heavy_only",
        label: "Heavy Armor Only"
      },
      {
        value: "armor_light_only",
        label: "Light Armor Only"
      },
      {
        value: "armor_light_head",
        label: "Light Head Armor"
      },
      {
        value: "armor_light_body",
        label: "Light Body Armor"
      },
      {
        value: "armor_light_arms",
        label: "Light Arm Armor"
      },
      {
        value: "armor_light_hands",
        label: "Light Hand Armor"
      },
      {
        value: "armor_light_waist",
        label: "Light Waist Armor"
      },
      {
        value: "armor_light_legs",
        label: "Light Leg Armor"
      },
      {
        value: "armor_light_feet",
        label: "Light Foot Armor"
      },
      {
        value: "armor_heavy_head",
        label: "Heavy Head Armor"
      },
      {
        value: "armor_heavy_body",
        label: "Heavy Body Armor"
      },
      {
        value: "armor_heavy_arms",
        label: "Heavy Arm Armor"
      },
      {
        value: "armor_heavy_hands",
        label: "Heavy Hand Armor"
      },
      {
        value: "armor_heavy_waist",
        label: "Heavy Waist Armor"
      },
      {
        value: "armor_heavy_legs",
        label: "Heavy Leg Armor"
      },
      {
        value: "armor_heavy_feet",
        label: "Heavy Foot Armor"
      }
    ]
  };
  return [name, level, chance_imbued, chance_enchanted, restriction];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>