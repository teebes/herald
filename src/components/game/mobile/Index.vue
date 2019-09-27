<template>
  <div id="augmented-game-mobile" class="game-frame flex flex-grow flex-col">
    <component
      :is="mainComponent"
      class="mobile-main"
      :selectedTab="selectedTab"
      @taplook="onTap('look')"
    ></component>
    <Menu v-if="is_menu_open" v-closable="{ handler: 'closeMenu', exclude: ['footer']}" />
    <Footer @tap="onTap" :selectedTab="selectedTab" ref="footer" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import eventbus from "@/core/eventbus.ts";
import Footer from "./Footer.vue";
import Look from "./Look.vue";
import Info from "./Info.vue";
import Menu from "./Menu.vue";

@Component({
  components: {
    Footer,
    Info,
    Look,
    Menu
  }
})
export default class MobileGame extends Vue {
  @Prop() messages: any;

  is_menu_open: boolean = false;

  selectedTab: string = "look";

  // When combat is initiated on mobile, we take the user to the info tab by
  // default because we want them to see the combat window. But if they
  // manually click back on Look after that, we don't want to re-switch them
  // on the next attack since they signaled they want to stay there.
  // This variable helps us track this behavior.
  clickedToLook: boolean = false;

  // Since we're tracking rooms changing, we want to know what the last
  // viewed room was, because vuex will trigger a change even if the room
  // itself hasn't changed, and we don't want to trigger 'look' every
  // beat
  lastRoom: any;

  constructor() {
    super();
    this.lastRoom = { ...this.$store.state.game.room } || null;
  }

  get mainComponent() {
    if (this.selectedTab === "info") return "Info";
    return "Look";
  }

  onTap(selected) {
    if (selected === "menu") {
      this.is_menu_open = !this.is_menu_open;
      return;
    }

    this.is_menu_open = false;

    if (selected === "look" && this.selectedTab === "look") {
      this.$store.dispatch("game/cmd", "look");
      return;
    }

    this.selectedTab = selected;

    if (selected !== "info") {
      this.clickedToLook = true;
    }

    if (selected === "look" || selected === "type") {
      Vue.nextTick(() => {
        eventbus.$emit("scroll-down");
      });
    }
  }

  @Watch("player.state")
  onChangePlayer(player_state) {
    if (player_state === "combat") {
      this.onTap("info");
    }
  }

  @Watch("player.room")
  onPlayerRoomChange(room) {
    if (!this.lastRoom) {
      this.lastRoom = room;
    } else if (this.lastRoom.key !== room.key) {
      this.lastRoom = room;
    } else {
      return;
    }

    if (room && room.key && this.selectedTab !== "look") {
      this.onTap("look");
    }
  }

  get player() {
    return this.$store.state.game.player;
  }

  closeMenu(event) {
    if (this.is_menu_open) {
      this.is_menu_open = false;
    }
  }
}
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

