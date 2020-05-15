<template>
  <div>
    <div class="mb-2">Click on a slot to view the options for it:</div>

    <div class="flex">
      <div class='slots'>
        <div v-for="(slot, index) in slots" 
             :key="index" @click="onClickSlot(slot)" 
             class='hover'
             :class="{'color-text-50': slot != selectedSlot}">
          {{ slot }}
        </div>
      </div>
      <div class="slot-options ml-4 flex-grow">
        <div v-if="selectedSlot">
          <div v-if="this.message.data[selectedSlot] && this.message.data[selectedSlot].length">
            <div v-for="item in this.message.data[selectedSlot]" :key="item.key">
              <span v-if="isEquipped(item, selectedSlot)">*</span>
              <span
                v-if="isLastMessage"
                v-interactive="{target: item}"
                class='interactable'
                :class="[item.quality]"
                :key="item.key + '-interactive'"
              >{{ item.name }}</span>
              <span v-else
                :class="[item.quality]"
                :key="item.key"        
              >{{ item.name }}</span>
            </div>
          </div>
          <div v-else>
            No items for this slot.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EQUIPMENT_SLOT_LIST } from "@/constants.ts";

@Component
export default class ConsoleInventory extends Vue {
  @Prop() message!: any;
  selectedSlot: string = "weapon";

  get isLastMessage() {
    return (
      this.$store.state.game.last_message[this.message.type] == this.message
    );
  }

  get slots() {
    return EQUIPMENT_SLOT_LIST;
  }

  onClickSlot(slot) {
    this.selectedSlot = slot;
  }

  isEquipped(item, slot) {
    if (
      this.$store.state.game.player.equipment[slot] &&
      item.key == this.$store.state.game.player.equipment[slot].key
    )
      return true;
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>