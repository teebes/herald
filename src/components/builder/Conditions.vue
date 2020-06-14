<template>
  <div class='form-group'>
    <label for="field-conditions">Conditions</label>

      <div v-if="!internalValue">add condition | set manually</div>

      <!-- Any condition value with parentheses won't be parsable by the UI -->
      <div v-if="isComplexCondition">{{ internalValue }} | set manually</div>
      <div v-else>
        <div v-for="(condition, index) in splitConditions" :key="index">
          <Condition v-model="internalValue" :conditions="CONDITIONS"/>
        </div>
        <div>set manually</div>
      </div>  
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Condition from "./Condition.vue";

const CONDITIONS = [
  {
    value: "level_above",
    label: "Level Above",
    args: ["Level Number"]
  },
  {
    value: "level_below",
    label: "Level Below",
    args: ["Level Number"]
  },
  {
    value: "item_in_room",
    label: "Item in Room",
    args: ["Template ID"]
  },
  {
    value: "item_in_inv",
    label: "Item in Inventory",
    args: ["Template ID", "Quantity"]
  },
  {
    value: "archetype",
    label: "Archetype",
    args: ["Archetype"]
  },
  {
    value: "mob_in_room",
    label: "Mob in Room",
    args: ["Template ID"]
  },
  {
    value: "quest_complete",
    label: "Quest Complete",
    args: ["Quest ID"]
  },
  {
    value: "core_faction",
    label: "Core Faction",
    args: ["Faction Code"]
  },
  {
    value: "standing_above",
    label: "Standing Above",
    args: ["Faction Code", "Standing"]
  },
  {
    value: "health_below",
    label: "Health Below",
    args: ["Percentage"]
  },
  {
    value: "item_in_eq",
    label: "Item in Equipment",
    args: ["Template ID"]
  }
];

@Component({
  components: {
    Condition
  }
})
export default class ConditionsView extends Vue {
  @Prop() value!: any;

  internalValue: any = this.value;
  CONDITIONS = CONDITIONS;

  get isComplexCondition() {
    if (
      this.internalValue.indexOf("(") !== -1 ||
      this.internalValue.indexOf(")") !== -1
    ) {
      return true;
    }
    return false;
  }

  get splitConditions() {
    /*
    If the condition's value is:
    not core_faction orc and level_above 1 or archetype mage
    the split conditions should be:
    [
      {
        'code': 'core_faction',
        
      }
    ]
    */
    return this.internalValue.split(/ and | or /);
  }

  mounted() {}
}
</script>