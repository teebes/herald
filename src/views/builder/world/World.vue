<template>
  <div id="world-details">
    <div class="world-map" id="world_map">
      <Map
        v-if="isMapReady"
        :key="mapKey"
        :radius="map_radius"
        :center_key="center_key"
        :map="map"
        :unit="8"
        @clickRoom="onMapClickRoom"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { MAP_CONFIG } from "@/config";
import { get_map_dimensions } from "@/core/map";
import Map from "@/components/ui/Map.vue";
import _ from "lodash";

const store = useStore();

const map_radius = ref(0);
const mapKey = ref(0);

const isMapReady = computed(() => {
  if (map_radius.value &&
      store.state.builder.room &&
    store.state.builder.map) return true;
  return false;
});

const center_key = computed(() => store.state.builder.room.key);
const map = computed(() => store.state.builder.map);

const onMapClickRoom = (room) => {
  store.dispatch('builder/room_select', room);
};

// import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
// import WorldView from "@/components/builder/world/WorldView.ts";
// import { MapRoomClick } from "@/components/builder/Mixins.ts";
// export default class WorldAdmin extends Mixins(MapRoomClick, WorldView) {


const measureMapcontainer = () => {
  /* Figure out what size the map should be based on the div dimensions */
  const map_el = document.getElementById("world_map") as HTMLElement;
  const width = map_el.clientWidth;
  const height = map_el.clientHeight;

  let small_side = width < height ? width : height;

  const unit = MAP_CONFIG.UNIT;
  const map_dimensions = get_map_dimensions(small_side, unit);

  map_radius.value = map_dimensions.radius;
};

const onResize = () => {
  map_radius.value = 0;
  measureMapcontainer();
  mapKey.value += 1;
};

const debouncedResize = _.debounce(onResize, 100);

onMounted(() => {
  measureMapcontainer();
  window.addEventListener("resize", debouncedResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", debouncedResize);
});
</script>

<style lang="scss">
#world-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .world-map {
    flex-grow: 1;
  }
}
</style>