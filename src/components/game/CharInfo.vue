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
    <div class="description" v-if="char.description">{{ char.description }}</div>
  
    <div class="equipment" v-if="slots && slots.length">
      <div>{{ this.$capfirst(char.name) }} is using:</div>
      <div v-for="(slot, index) in slots" :key="index">
        <span class="font-text-regular">{{ slot.slotName }}</span>:
        <span 
          :class="{ ['color-secondary']: slot.slotItemIsMagic }"
          v-interactive="{target: slot.slotItem, isLastMessage: isLastMessage}"
        >{{ slot.slotItemName }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EQUIPMENT_SLOT_LIST } from "@/constants";
import { capfirst } from "@/core/utils.ts";

@Component
export default class CharInfo extends Vue {
  @Prop() char!: any;
  @Prop() isLastMessage!: boolean;

  get slots() {
    const slots: {}[] = [];
    for (const slot of EQUIPMENT_SLOT_LIST) {
      const eq = this.char.equipment;
      if (eq && eq[slot]) {
        slots.push({
          slotName: capfirst(slot),
          slotItemName: eq[slot].name,
          slotItemIsMagic: eq[slot].is_magic,
          slotItem: eq[slot]
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