<template>
  <div>
    <div class="name">{{ this.$capfirst(char.name) }}</div>
    <div class="summary">
      Level {{ char.level }} {{ char.gender }} {{ char.archetype }}
      <template v-if="char.is_elite">
        &nbsp;[&nbsp;
        <span class="color-primary">elite</span>&nbsp;]
      </template>
    </div>
    <div class="health color-text-50">Health: {{ char.health }} / {{ char.health_max }}</div>
    <div class="description">{{ char.description }}</div>

    <div class="equipment" v-if="slots">
      <div>{{ this.$capfirst(char.name) }} is using:</div>
      <div v-for="(slot, index) in slots" :key="index">
        <span class="font-text-regular">{{ slot.slotName }}</span>:
        <span :class="{ ['color-secondary']: slot.slotItemIsMagic }">{{ slot.slotItemName }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EQUIPMENT_SLOT_LIST } from "@/constants";
import { capfirst } from "@/helpers/utils.ts";

@Component
export default class CharInfo extends Vue {
  @Prop() char!: any;

  get slots() {
    const slots: {}[] = [];
    for (const slot of EQUIPMENT_SLOT_LIST) {
      //_.each(Constants.EQUIPMENT_SLOTS, function(slot) {
      const eq = this.char.equipment;
      //var eq = self.model.attributes.equipment;
      if (eq && eq[slot]) {
        slots.push({
          slotName: capfirst(slot),
          slotItemName: eq[slot].name,
          slotItemIsMagic: eq[slot].is_magic
        });
      }
    }
    return slots;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>