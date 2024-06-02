<template>
  <div class="inventory-view indented">
    <div v-if="inventory.length === 1">You are carrying 1 item:</div>
    <div v-else-if="inventory.length === 0">You are not carrying any items.</div>
    <div v-else>You are carrying {{inventory.length}} items:</div>

    <ul class="list">
      <li v-for="(item, index) in inventoryStack" :key="index" class="inventory-item">
        <span
          v-if="isLastMessage"
          v-interactive="{target: item}"
          class='interactive'
          :class="[item.quality]"
          @click="isLastMessage && onItemClick(item)"
        >{{ item.name }}</span>
        <span v-else
          :class="[item.quality]"
        >{{ item.name }}</span>
        <span class="item-count" v-if="item.count && item.count > 1">&nbsp;[{{item.count}}]</span>
      </li>
    </ul>

    <div class="gold-inv">You have {{ player.gold }} gold.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { stackedInventory, getTargetInGroup } from "@/core/utils.ts";

const store = useStore();

interface InventoryMessage {
  type: string;
  data: {
    inventory: {}[];
  };
}

const props = defineProps<{
  message: InventoryMessage;
}>();

const player = computed(() => store.state.game.player);
const inventory = computed(() => player.value.inventory);
const isLastMessage = computed(() => store.state.game.last_message[props.message.type] == props.message);

// Inventory Stack
const inventoryStack = ref<any[]>([]);
const updateInventoryStack = () => {
  inventoryStack.value = stackedInventory(inventory.value);
}
watch(inventory, () => {
  updateInventoryStack();
}, { immediate: true });


const onItemClick = (item) => {
  if (store.state.game.is_mobile) return;
  const target = getTargetInGroup(item, inventory.value);
  store.dispatch("game/cmd", `drop ${target}`);
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>