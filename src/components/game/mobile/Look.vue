<template>
  <div id="mobile-look">
    <div class="mobile-mini-map" @click.stop="onClickMiniMap" v-if="mapDisplay == 'mini'">
      <GameMap :radius="map_width" :key="map_width"/>
    </div>

    <div class="mobile-map-full-region" v-if="mapDisplay == 'full'" ref="fullmap">

      <div class="mobile-map-full">
        <div class="map-region">
          <GameMap :radius="5" />
        </div>
        <div class="room-name">{{ room.name }}</div>
        <Exits />
      </div>
    </div>
    <Console class="flex-grow" />
    <Hint v-if="hint && hint.split(':')[0] === '9'" />
    <Exits v-if="hasExits && selectedTab === 'look' && mapDisplay === 'mini'" />
    <Hint v-if="hint && hint.split(':')[0] !== '9'" />
    <Input v-if="selectedTab === 'type'" />
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { DIRECTIONS } from "@/constants";
import eventbus from "@/core/eventbus";
import { onOutsideClick } from "@/composables/onOutsideClick";
import Console from "@/components/game/console/Console.vue";
import Exits from "@/components/game/mobile/Exits.vue";
import Input from "@/components/game/Input.vue";
import GameMap from "@/components/game/panel/Map.vue";
import Hint from "@/components/game/console/Hint.vue";

const store = useStore();

defineProps<{
  selectedTab: string;
}>();
const emit = defineEmits(["taplook"]);

const fullmap = onOutsideClick(() => {
  onClickFullMap();
});

const mapDisplay = ref<string>("mini"); // or 'full'

const hint = computed(() => store.state.game.hint);
const room = computed(() => store.state.game.room);
const hasExits = computed(() => {
  if (room.value.hint === "7:Enter 'look' or 'l'") {
    return false;
  }

  for (const direction in DIRECTIONS) {
    if (room.value[direction]) return true;
  }
  return false;
});

const map_width = computed(() => parseInt(store.state.game.player_config.mobile_map_width));

const onClickMiniMap = () => {
  mapDisplay.value = "full";
};

const onClickFullMap = () => {
  mapDisplay.value = "mini";
  nextTick(() => {
    eventbus.emit("scroll-down");
  });
};
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