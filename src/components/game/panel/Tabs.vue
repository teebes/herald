<template>
  <div>
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
      >Stats</div>
    </div>
    <component
      :is="activeTab"
      class="tab-contents-region flex flex-col"
      @taplook="$emit('taplook')"
    ></component>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Vitals from "../panel/Vitals.vue";
import Items from "../panel/Items.vue";
import Equipment from "../panel/Equipment.vue";
import Stats from "../panel/Stats.vue";

@Component({
  components: {
    Vitals,
    Items,
    Equipment,
    Stats
  }
})
export default class MobilePanelTabs extends Vue {
  selectedTab: string = "vitals";

  get activeTab() {
    if (this.selectedTab === "items") return "Items";
    if (this.selectedTab === "eq") return "Equipment";
    if (this.selectedTab === "stats") return "Stats";
    return "Vitals";
  }

  isSelected(selected) {
    return selected === this.selectedTab;
  }

  onClick(tab) {
    this.selectedTab = tab;
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

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

.tab-contents-region {
  order: 2;
  flex: 1 1;
}

#mobile-panel {
  .tabs {
    order: 3;
  }
  .tab-contents-region {
    padding: 20px 0 15px 0;
  }
}
//   .tab-contents-region {
//     order: 1;
//   }
// }
</style>