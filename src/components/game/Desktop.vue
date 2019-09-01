<template>
  <div id="augmented-game-desktop" class="flex flex-grow flex-row game-frame">
    <DesktopPanel />

    <div class="flex-grow flex flex-col">
      <Console :messages="messages" class="flex-grow" />
      <Hint v-if="$store.state.game.hint" />
      <Input @input="onInput" />
    </div>

    <div
      class="desktop-lookup"
      v-if="lookup"
      v-closable="{ handler: 'closeLookup'}"
      :style="lookupPosition"
      @mouseleave="onMouseOut"
      @mouseover="onMouseOver"
    >
      <Lookup />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Input from "./Input.vue";
import Console from "./Console.vue";
import DesktopPanel from "./panel/Desktop.vue";
import Lookup from "./Lookup.vue";
import Hint from "./Hint.vue";
import _ from "lodash";

@Component({
  components: {
    Console,
    DesktopPanel,
    Input,
    Lookup,
    Hint
  }
})
export default class DesktopGame extends Vue {
  @Prop() messages: any;

  get lookup() {
    return this.$store.state.game.lookup;
  }

  get lookupPosition() {
    return {
      left: 50 + this.lookup.position.left + "px",
      bottom: window.innerHeight - this.lookup.position.top + "px"
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

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

#augmented-game-desktop {
  @media ($game-mobile-site) {
    display: none;
  }

  position: relative;

  .desktop-lookup {
    position: absolute;
  }
}
</style>

