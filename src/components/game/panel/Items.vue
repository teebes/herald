<template>
  <div>
    <div class="inventory-view">
      <div
        class="inventory-item interactive"
        :class="[item.quality]"
        v-for="item in stackedInventory(player.inventory)"
        :key="item.key"
        action="drop"
        :keyword="item.keywords.split(' ')[0]"
        @click="onItemClick(item)"
      >
        <span v-interactive="{target: item}" class="interactive">{{ item.name }}</span>
        <span class="item-count" v-if="item.count && item.count > 1">&nbsp;[{{item.count}}]</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { stackedInventory, getTargetInGroup } from "@/core/utils.ts";

@Component({})
export default class PanelItems extends Vue {
  stackedInventory = stackedInventory;

  get player() {
    return this.$store.state.game.player;
  }

  onItemClick(item) {
    const target = getTargetInGroup(item, this.player.inventory);
    this.$store.dispatch("game/cmd", `drop ${target}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.inventory-view {
  padding: 0 20px;
  margin-top: auto;
}
</style>