<template>
  <div class='tabs-view'>
    <div class="tabs">
      <div
        class="tab-item unselectable"
        tab="actions"
        :class="{ activeTab: isSelected('vitals')}"
        @click="onClick('vitals')"
      >Vitals</div>
      <div
        class="tab-item unselectable"
        tab="inventory"
        :class="{ activeTab: isSelected('items')}"
        @click="onClick('items')"
      >Items</div>
      <div
        class="tab-item unselectable"
        tab="equipment"
        :class="{ activeTab: isSelected('eq')}"
        @click="onClick('eq')"
      >EQ</div>
      <div
        class="tab-item unselectable"
        tab="stats"
        :class="{ activeTab: isSelected('stats')}"
        @click="onClick('stats')"
        v-if="world.allow_combat"
      >Stats</div>
    </div>
    <component
      :is="activeTab"
      class="tab-contents-region flex flex-col"
      @taplook="$emit('taplook')"
    ></component>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Vitals from "@/components/game/panel/Vitals.vue";
import Items from "@/components/game/panel/Items.vue";
import Equipment from "@/components/game/panel/Equipment.vue";
import Stats from "@/components/game/panel/Stats.vue";

const store = useStore();

const selectedTab = ref("vitals");

const world = computed(() => store.state.game.world);
const activeTab = computed(() => {
  if (selectedTab.value === "items") return Items;
  if (selectedTab.value === "eq") return Equipment;
  if (selectedTab.value === "stats") return Stats;
  return Vitals;
});

const isSelected = (selected) => selected === selectedTab.value;

const onClick = (tab) => { selectedTab.value = tab; }
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.tabs-view {
  .tabs {
    display: flex;
    padding: 0 20px;
    margin: 10px 0;
    border-bottom: 1px solid $color-background-light;
    order: 1;

    @include font-title-light;
    font-size: 16px;
    line-height: 18px;

    .tab-item {
      color: $color-text-hex-30;
      padding: 10px;
      position: relative;

      &.activeTab {
        border: 2px solid $color-background-light;
        border-bottom: 2px solid $color-background-black;
        border-radius: 4px 4px 0 0;
        color: $color-text;
        top: 1px;
      }
      &:not(.activeTab) {
        top: 3px;
        padding: 10px 12px;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  overflow-y: hidden;
  .tab-contents-region {
    order: 2;
    flex: 1 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
  }

  #mobile-panel {
    .tabs {
      order: 3;
    }
    .tab-contents-region {
      padding: 20px 0 15px 0;
    }
  }
}
</style>