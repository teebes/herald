<template>
  <div class="inventory-view indented">
    <div v-if="inventory.length === 1">You are carrying 1 item:</div>
    <div v-else-if="inventory.length === 0">You are not carrying any items.</div>
    <div v-else>You are carrying {{inventory.length}} items:</div>

    <ul class="list">
      <li v-for="item in inventoryStack" :key="item.display_key" class="inventory-item">
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

    <div class="gold-inv">You have {{ gold }} gold.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { stackedInventory, getTargetInGroup } from "@/core/utils.ts";

const store = useStore();

const props = defineProps<{
  message: any;
}>();

const gold = props.message.data.actor.gold;
const inventory = props.message.data.actor.inventory;
const inventoryStack = stackedInventory(inventory);
const isLastMessage = computed(() => store.state.game.last_message[props.message.type] == props.message);

const onItemClick = (item) => {
  if (store.state.game.is_mobile) return;
  const target = getTargetInGroup(item, inventory);
  store.dispatch("game/cmd", `drop ${target}`);
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>