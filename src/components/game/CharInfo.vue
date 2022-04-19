<template>
  <div>
    <div class="name">{{ this.$capfirst(char.name) }}</div>
    <div class="summary" v-if="world.allow_combat">
      Level {{ char.level }} {{ gender }} {{ char.archetype }}
      <template v-if="char.is_elite">
        &nbsp;[&nbsp;
        <span class="color-primary">elite</span>&nbsp;]
      </template>
    </div>
    <div class="health color-text-50" v-if="world.allow_combat">
      Health: {{ char.health }} / {{ char.health_max }}
    </div>

    <div class="description" v-if="descLines.length">
      <div class="description-line" v-for="(line, index) in descLines" :key="index">{{ line }}</div>
    </div>

    <!-- <div class="description" v-if="char.description">
      {{ char.description }}
    </div> -->

    <div class="equipment" v-if="slots && slots.length">
      <div>{{ this.$capfirst(char.name) }} is using:</div>
      <div v-for="slot in slots" :key="slot.slotItem.key">
        <span class="font-text-regular">{{ slot.slotName }}</span>:
        <span v-if="isLastMessage"
          :class="{ ['color-secondary']: slot.slotItemIsMagic }"
          class='interactable'
          v-interactive="{target: slot.slotItem}"
        >{{ slot.slotItemName }}</span>
        <span v-else :class="{ ['color-secondary']: slot.slotItemIsMagic }">{{ slot.slotItemName }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EQUIPMENT_SLOT_LIST } from "@/constants";
import { capfirst } from "@/core/utils.ts";

@Component
export default class CharInfo extends Vue {
  @Prop() char!: any;
  @Prop() message!: any;
  @Prop() isLastMessage!: any;

  get slots() {
    const slots: {}[] = [];
    for (const slot of EQUIPMENT_SLOT_LIST) {
      const eq = this.char.equipment;
      if (eq && eq[slot]) {
        slots.push({
          slotName: capfirst(slot),
          slotItemName: eq[slot].name,
          slotItemIsMagic: eq[slot].is_magic,
          slotItem: eq[slot],
        });
      }
    }
    return slots;
  }

  get gender() {
    if (this.char.gender == "non_binary") return "non-binary";
    return this.char.gender;
  }

  get world() {
    return this.$store.state.game.world;
  }

  get descLines() {
    if (this.char.description) return this.char.description.split('\n');
    return [];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
