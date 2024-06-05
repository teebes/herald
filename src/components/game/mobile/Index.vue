<template>
  <div id="augmented-game-mobile" class="game-frame flex flex-grow flex-col">
    <component
      :is="mainComponent"
      class="mobile-main"
      :selectedTab="selectedTab"
      @taplook="onTap('look')"
    ></component>
    <Menu v-if="is_menu_open" @closeMenu="closeMenu" />
    <Footer @tap="onTap" :selectedTab="selectedTab" ref="footer" />
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, nextTick, watch } from "vue";
import { useStore } from "vuex";
import eventbus from "@/core/eventbus";
import Footer from "./Footer.vue";
import Look from "./Look.vue";
import Info from "./Info.vue";
import Menu from "./Menu.vue";

const store = useStore();

const is_menu_open = ref<boolean>(false);
const selectedTab = ref<string>("look");

// When combat is initiated on mobile, we take the user to the info tab by
// default because we want them to see the combat window. But if they
// manually click back on Look after that, we don't want to re-switch them
// on the next attack since they signaled they want to stay there.
// This variable helps us track this behavior.
const clickedToLook = ref<boolean>(false);

// Since we're tracking rooms changing, we want to know what the last
// viewed room was, because vuex will trigger a change even if the room
// itself hasn't changed, and we don't want to trigger 'look' every
// beat
const lastRoom = ref<any>(store.state.game.room || null);

  // constructor() {
  //   super();
  //   this.lastRoom = { ...this.$store.state.game.room } || null;
  // }

const player = computed(() => store.state.game.player);

const mainComponent = computed(() => {
  if (selectedTab.value === "info") return Info;
  return Look;
});

const onTap = (selected: string) => {
  if (selected === "menu") {
    is_menu_open.value = !is_menu_open.value;
    return;
  }

  is_menu_open.value = false;

  if (selected === "look" && selectedTab.value === "look") {
    store.dispatch("game/cmd", "look");
    return;
  }

  selectedTab.value = selected;

  if (selected !== "info") {
    clickedToLook.value = true;
  }

  if (selected === "look" || selected === "type") {
    nextTick(() => {
      eventbus.emit("scroll-down");
    });
  }
};

watch(() => player.value.state, (player_state) => {
  if (player_state === "combat") {
    onTap("info");
  }
});


watch(() => player.value.room, (room) => {
  if (!lastRoom.value) {
    lastRoom.value = room;
  } else if (lastRoom.value.key !== room.key) {
    lastRoom.value = room;
  } else {
    return;
  }

  // if (room && room.key && selectedTab.value !== "look") {
  //   onTap("look");
  // }
});

const closeMenu = () => {
  if (is_menu_open.value) {
    is_menu_open.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

#augmented-game-mobile {
  @media ($game-desktop-site) {
    display: none;
  }

  font-size: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  .mobile-main {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: hidden;
  }
}
</style>
