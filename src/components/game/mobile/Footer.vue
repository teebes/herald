<template>
  <div class="mobile-footer-region">
    <div
      class="footer-tab look"
      :class="{ active_tab: isActive('look')}"
      @click="emit('tap', 'look')"
    >
      <span class="unselectable">Look</span>
    </div>
    <div
      class="footer-tab info"
      :class="{ active_tab: isActive('info')}"
      @click="emit('tap', 'info')"
    >
      <span class="unselectable">Info</span>
    </div>
    <div
      class="footer-tab type"
      :class="{ active_tab: isActive('type')}"
      @click="emit('tap', 'type')"
    >
      <span class="unselectable">Type</span>
    </div>
    <div
      class="footer-menu menu"
      :class="{ active_tab: isActive('menu')}"
      @click="emit('tap', 'menu')"
    >
      <span class="unselectable">Menu</span>
    </div>
  </div>
</template>

<script lang='ts' setup>
const props = defineProps<{
  selectedTab: string;
}>();
const emit = defineEmits(["tap"]);

const isActive = (tab: string) => tab === props.selectedTab;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.mobile-footer-region {
  background: $color-background-black;
  border-top: 1px solid $color-background-light-border;
  flex: 0 0 60px;
  display: flex;

  .footer-tab,
  .footer-menu {
    @include font-title-light;
    font-size: 19px;
    line-height: 30px;

    border-right: 1px solid $color-background-light-border;
    flex: 1 0;
    display: flex;
    &:hover {
      cursor: pointer;
    }
    &:last-child {
      border-right: 0;
    }

    span {
      opacity: 0.3;
      margin: auto;
    }

    &.active_tab > span {
      opacity: 1;
    }
  }
}
</style>