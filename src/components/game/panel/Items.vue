<template>
  <div>
    <div class="inventory-view">
      <div
        class="inventory-item"
        :class="[item.quality]"
        v-for="item in inventory"
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

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from 'vuex';
import { stackedInventory, getTargetInGroup } from "@/core/utils";

const store = useStore();

const player = computed(() => store.state.game.player);
const inventory = computed(() => stackedInventory(player.value.inventory));

const onItemClick = (item) => {
  if (store.state.game.is_mobile) return;
  const target = getTargetInGroup(item, player.value.inventory);
  store.dispatch("game/cmd", `drop ${target}`);
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.inventory-view {
  padding: 0 20px;
}
</style>