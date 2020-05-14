<template>
  <div class="inventory-view indented">
    <div v-if="inventory.length === 1">You are carrying 1 item:</div>
    <div v-else-if="inventory.length === 0">You are not carrying any items.</div>
    <div v-else>You are carrying {{inventory.length}} items:</div>

    <ul class="list">
      <li v-for="(item, index) in stackedInventory(inventory)" :key="index" class="inventory-item">
        <span
          v-if="isLastMessage"
          v-interactive="{target: item}"
          class='interactable'
          :class="[item.quality]"
          :key="item.key + '-interactive'"
          @click="isLastMessage && onItemClick(item)"
        >{{ item.name }}</span>
        <span v-else
          :class="[item.quality]"
          :key="item.key"        
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
  type: string;
  data: {
    inventory: {}[];
  };
}

@Component
export default class ConsoleInventory extends Vue {
  @Prop() message!: InventoryMessage;
  player: any = {};

  constructor() {
    super();
    this.player = this.$store.state.game.player;
  }

  stackedInventory = stackedInventory;

  get inventory() {
    return this.player.inventory;
    // return this.message.data.inventory;
  }

  // get player() {
  //   return this.$store.state.game.player;
  // }

  get isLastMessage() {
    return (
      this.$store.state.game.last_message[this.message.type] == this.message
    );
  }

  onItemClick(item) {
    if (this.$store.state.game.is_mobile) return;
    const target = getTargetInGroup(item, this.inventory);
    this.$store.dispatch("game/cmd", `drop ${target}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>