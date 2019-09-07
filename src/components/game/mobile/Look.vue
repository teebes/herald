<template>
  <div id="mobile-look">
    <div class="mobile-mini-map" @click="onClickMiniMap" v-if="mapDisplay == 'mini'">
      <GameMap radius="1" />
    </div>
    <div
      class="mobile-map-full-region"
      v-if="mapDisplay == 'full'"
      v-closable="{ handler: 'onClickFullMap'}"
    >
      <div class="mobile-map-full">
        <div class="map-region">
          <GameMap radius="5" />
        </div>
        <div class="room-name">{{ room.name }}</div>
        <Exits />
      </div>
    </div>
    <Console class="flex-grow" />
    <Hint v-if="$store.state.game.hint && $store.state.game.hint.split(':')[0] === '9'" />
    <Exits v-if="hasExits && selectedTab === 'look' && mapDisplay === 'mini'" />
    <Hint v-if="$store.state.game.hint && $store.state.game.hint.split(':')[0] !== '9'" />
    <Input v-if="selectedTab === 'type'" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DIRECTIONS } from "@/constants.ts";
import Console from "../Console.vue";
import Exits from "./Exits.vue";
import Input from "../Input.vue";
import GameMap from "../panel/Map.vue";
import Hint from "../Hint.vue";

@Component({
  components: {
    Console,
    Exits,
    Input,
    GameMap,
    Hint
  }
})
export default class MobileLook extends Vue {
  @Prop() selectedTab!: string;

  mapDisplay: string = "mini"; // or 'full'

  onClickMiniMap() {
    this.mapDisplay = "full";
  }

  onClickFullMap() {
    this.mapDisplay = "mini";
  }

  get room() {
    return this.$store.state.game.room;
  }

  get hasExits() {
    for (const direction in DIRECTIONS) {
      if (this.room[direction]) return true;
    }
    return false;
  }
}
</script>

<style lang='scss'>
@import "@/styles/fonts.scss";
@import "@/styles/colors.scss";
#mobile-look {
  .mobile-mini-map {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 500;

    .map-wrapper > .map-view > #map {
      background: rgba(26, 26, 28, 0.8);
      border: 1px solid #242629;
    }
  }

  .mobile-map-full-region {
    position: absolute;
    top: 0;
    background: #121315;
    border-bottom: 1.5px solid $color-mobile-border;
    z-index: 10000;

    width: 100%;

    .mobile-map-full {
      padding-top: 20px;

      .room-name {
        @include font-text-light;
        //margin: 10px 0 15px 0;
        margin: 10px 0 0px 0;

        display: flex;
        justify-content: center;
      }

      .map-region {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .directions-pad {
        border-top: 1px solid $color-mobile-border;
        margin-top: 10px;
        padding: 20px 0;
      }
    }
  }

  .directions-pad {
    flex-shrink: 0;
  }

  #input {
    padding: 0 20px;
  }
}
</style>