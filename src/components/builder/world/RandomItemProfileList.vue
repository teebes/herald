<template>
  <EditableCollection
    title="Random Item Profile"
    name="random_profiles"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import WorldView from "@/components/builder/WorldView.ts";
import RandomItemProfile from "@/components/builder/world/RandomItemProfile.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/randomitemprofiles/`;
  }

  get display_component() {
    return RandomItemProfile;
  }

  get schema() {
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
        }
      ]
    };
    return [name, level, chance_imbued, chance_enchanted, restriction];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>