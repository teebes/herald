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
          <div v-if="message.data[selectedSlot] && message.data[selectedSlot].length">
            <div v-for="item in message.data[selectedSlot]" :key="item.key">
              <span v-if="isEquipped(item, selectedSlot)">*</span>
              <span
                v-if="isLastMessage"
                v-interactive="{target: item}"
                class='interactive'
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

<script lang='ts' setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { EQUIPMENT_SLOT_LIST } from "@/constants.ts";

const store = useStore();
const props = defineProps<{ message: any }>();

const selectedSlot = ref("weapon");

const isLastMessage = computed(() => {
  return store.state.game.last_message[props.message.type] == props.message;
});
const slots = EQUIPMENT_SLOT_LIST;

const onClickSlot = (slot) => {
  selectedSlot.value = slot;
};

const isEquipped = (item, slot) => {
  if (
    store.state.game.player.equipment[slot] &&
    item.key == store.state.game.player.equipment[slot].key
  )
    return true;
  return false;
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>