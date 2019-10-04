<template>
  <div id="world-details">
    <div class="world-map" ref="world_map">
      <Map
        v-if="isMapReady"
        :radius="map_radius"
        :center_key="$store.state.builder.room.key"
        :map="$store.state.builder.map"
        :unit="8"
        @clickRoom="onMapClickRoom"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";

import { MAP_CONFIG } from "@/config";
import { get_map_dimensions } from "@/core/map";
import { DIRECTIONS } from "@/constants";
import Map from "@/components/Map.vue";
import { Room } from "@/core/interfaces";
import _ from "lodash";
import WorldView from "@/components/builder/WorldView.ts";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";
import { MapRoomClick } from "@/components/builder/Mixins.ts";

@Component({
  components: {
    Map
  }
})
export default class WorldAdmin extends Mixins(MapRoomClick, WorldView) {
  map_radius: number = 0;

  measureMapContainer() {
    /* Figure out what size the map should be based on the div dimensions */
    const map_el = this.$refs.world_map as HTMLElement;
    const width = map_el.clientWidth;
    const height = map_el.clientHeight;

    let small_side = width < height ? width : height;

    const unit = MAP_CONFIG.UNIT;
    const map_dimensions = get_map_dimensions(small_side, unit);

    this.map_radius = map_dimensions.radius;
  }

  async mounted() {
    this.measureMapContainer();
    window.addEventListener("resize", this.debouncedResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.debouncedResize);
  }

  debouncedResize = _.debounce(this.onResize, 100);

  onResize() {
    this.map_radius = 0;
    this.measureMapContainer();
  }

  get isMapReady() {
    if (
      this.map_radius &&
      this.$store.state.builder.room &&
      this.$store.state.builder.map
    )
      return true;
    return false;
  }
}
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