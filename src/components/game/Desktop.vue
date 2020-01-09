<template>
  <div id="augmented-game-desktop" class="flex flex-grow flex-row game-frame">
    <DesktopPanel />

    <div class="flex flex-grow">
      <div class="flex-grow flex flex-col">
        <Console :messages="messages" class="flex-grow" />
        <Hint v-if="$store.state.game.hint" />
        <Input @input="onInput" />
      </div>
      <Sidebar v-if="width > 950" />
    </div>

    <div
      class="desktop-lookup"
      v-if="lookup"
      v-closable="{ handler: 'closeLookup' }"
      :style="lookupPosition"
      @mouseleave="onMouseOut"
      @mouseover="onMouseOver"
    >
      <Lookup />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Input from "./Input.vue";
import Console from "./Console.vue";
import DesktopPanel from "./panel/Desktop.vue";
import Lookup from "./Lookup.vue";
import Hint from "./Hint.vue";
import Sidebar from "./Sidebar.vue";
import _ from "lodash";

@Component({
  components: {
    Console,
    DesktopPanel,
    Input,
    Lookup,
    Hint,
    Sidebar
  }
})
export default class DesktopGame extends Vue {
  @Prop() messages: any;
  @Prop() width!: number;

  get lookup() {
    return this.$store.state.game.lookup;
  }

  get lookupPosition() {
    if (!this.lookup) {
      return {};
    }
    return {
      left: 50 + this.lookup.position.left + "px",
      bottom: window.innerHeight - this.lookup.position.top + "px",
      "z-index": "10 !important"
    };
  }

  onInput(args) {
    this.$emit("input", args);
  }

  onType() {}

  created() {
    window.addEventListener("keypress", this.onType);
  }

  destroyed() {
    window.removeEventListener("keypress", this.onType);
  }

  onMouseOut = _.debounce(this.closeLookup, 150);

  closeLookup() {
    // If the entity being hovered on is the same as the one being looked up,
    // we don't close the lookup.
    if (
      this.$store.state.game.hover_entity &&
      this.$store.state.game.lookup &&
      this.$store.state.game.hover_entity.key ===
        this.$store.state.game.lookup.key
    ) {
      return;
    }
    this.$store.commit("game/lookup_clear");
    this.$store.commit("game/popup_hover_set", false);
  }

  onMouseOver() {
    this.$store.commit("game/popup_hover_set", true);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

#augmented-game-desktop {
  @media ($game-mobile-site) {
    display: none;
  }

  position: relative;

  .desktop-lookup {
    position: absolute;
    // Safari layering bug
    -webkit-transform: translate3d(0, 0, 0);
  }

  #input {
    padding: 0 20px;
  }
}
</style>
