<template>
  <div
    id="full-screen-message"
    v-if="$store.state.game.full_screen_message"
  >{{ $store.state.game.full_screen_message }}</div>
  <div id="game" v-else-if="loaded" class="flex flex-grow">
    <component
      :is="gameComponent"
      :messages="messages"
      :width="width"
      @input="onInput"
      class="flex-grow"
      v-if="$store.state.game.is_connected"
    ></component>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AccessibleGame from "./AccessibleGame.vue";
import AugmentedGame from "./AugmentedGame.vue";
import { LOBBY_WORLD_DETAIL } from "@/router";
import _ from "lodash";

@Component({
  components: {
    AccessibleGame,
    AugmentedGame
  }
})
export default class Game extends Vue {
  /*
    Before this view gets invoked, the player's ID gets stored in
    state.game.player_id.

    type: "system.connect",
    data: {"player_key": key}
  */

  websocket: WebSocket | undefined;
  //messages: {}[] = [];
  loaded: boolean = false;
  onResize: any;
  width: number = window.innerWidth;

  constructor() {
    super();
    this.websocket;

    this.onResize = _.debounce(this.resize, 500);
    this.$store.commit("game/width_set", this.width);
  }

  // Getters
  get accessibility() {
    return this.$store.state.auth.user.accessibility_mode;
  }

  get gameComponent() {
    if (this.accessibility) {
      return "AccessibleGame";
    } else {
      return "AugmentedGame";
    }
  }

  get messages() {
    return this.$store.state.game.messages;
  }

  async created() {
    if (!this.$store.state.game.player_id) {
      this.$router.push({ name: "lobby" });
    }
    this.loaded = true;
    window.addEventListener("resize", this.onResize);
  }

  async beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }

  async resize() {
    this.width = window.innerWidth;
    this.$store.commit("game/width_set", this.width);
  }

  onInput(input) {
    this.$store.dispatch("game/cmd", input);
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";

#full-screen-message {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

#game {
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  // .console-wrapper {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   min-height: 0;
  // }

  .game-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 0;
  }
}
</style>
