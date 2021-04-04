<template>
  <EditableCollection
    title="Starting EQ"
    registration_name="starting_eq"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import WorldView from "@/components/builder/world/WorldView.ts";
import StartingEqEntry from "@/components/builder/world/StartingEqEntry.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/startingeq/`;
  }

  get display_component() {
    return StartingEqEntry;
  }

  get schema() {
    /*
    - itemtemplate
    - archetype
    - num
    */
    const num: FormElement = {
      attr: "num",
      label: "Number of Copies"
    };
    const archetype: FormElement = {
          attr: "archetype",
          label: "Archetype",
          widget: "select",
          default: null,
          options: [
            {
              value: null,
              label: "All"
            },            
            {
              value: "warrior",
              label: "Warrior",
            },
            {
              value: "mage",
              label: "Mage",
            },
            {
              value: "cleric",
              label: "Cleric",
            },
            {
              value: "assassin",
              label: "Assassin",
            },
          ],
        };
    const item_template: FormElement = { 
      ...BUILDER_FORMS.ITEM_TEMPLATE,
      attr: 'itemtemplate',
    };
    
    return [item_template, num, archetype];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>