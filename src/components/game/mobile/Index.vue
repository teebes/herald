<template>
  <div id="augmented-game-mobile" class="game-frame flex flex-grow flex-col">
    <component :is="mainComponent" class="mobile-main" :selectedTab="selectedTab"></component>
    <Footer @tap="onTap" :selectedTab="selectedTab" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Footer from "./Footer.vue";
import Look from "./Look.vue";
import Info from "./Info.vue";

@Component({
  components: {
    Footer,
    Look,
    Info
  }
})
export default class MobileGame extends Vue {
  @Prop() messages: any;

  selectedTab: string = "look";

  // When combat is initiated on mobile, we take the user to the info tab by
  // default because we want them to see the combat window. But if they
  // manually click back on Look after that, we don't want to re-switch them
  // on the next attack since they signaled they want to stay there.
  // This variable helps us track this behavior.
  clickedToLook: boolean = false;

  get mainComponent() {
    if (this.selectedTab === "info") return "Info";
    return "Look";
  }

  onTap(selected) {
    // Tempoary
    if (selected === "menu") {
      this.$store.dispatch("game/cmd", "quit");
      return;
    }

    if (selected === 'look' && this.selectedTab === 'look') {
      this.$store.dispatch('game/cmd', 'look');
      return;
    }

    this.selectedTab = selected;
    if (selected !== "info") {
      this.clickedToLook = true;
    }
  }

  @Watch("target")
  onChangeTarget(target) {
    if (target && !this.clickedToLook) {
      this.onTap("info");
    }
  }

  get target() {
    return this.$store.state.game.player.target;
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

  .mobile-main {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: hidden;
  }
}
</style>

