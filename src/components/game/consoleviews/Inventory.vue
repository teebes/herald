<template>
  <div class="inventory-view">
    <div v-if="inventory.length === 1">You are carrying 1 item:</div>
    <div v-else-if="inventory.length === 0">You are not carrying any items.</div>
    <div v-else>You are carrying {{inventory.length}} items:</div>

    <ul class="list">
      <li v-for="(item, index) in stackedInventory(inventory)" :key="index" class="inventory-item">
        <span
          v-interactive="{target: item}"
          class="interactable"
          :class="[item.quality]"
          :key="item.key"
          :keyword="item.keyword"
          @click="onItemClick(item)"
        >{{ item.name }}</span>

        <span class="item-count" v-if="item.count && item.count > 1">&nbsp;[{{item.count}}]</span>
      </li>
    </ul>
    <div class="gold-inv">You have {{ player.gold }} gold.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { stackedInventory, getTargetInGroup } from "@/core/utils.ts";

interface InventoryMessage {
  data: {
    inventory: {}[];
  };
}

@Component
export default class ConsoleInventory extends Vue {
  @Prop() message!: InventoryMessage;

  stackedInventory = stackedInventory;

  get inventory() {
    return this.message.data.inventory;
  }

  get player() {
    return this.$store.state.game.player;
  }

  onItemClick(item) {
    const target = getTargetInGroup(item, this.inventory);
    this.$store.dispatch("game/cmd", `drop ${target}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.inventory-view {
}
</style>