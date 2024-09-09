<template>
  <div id="world-details">
    <div class="world-map" id="world_map">
      <div v-if="store.state.builder.world.builder_info.builder_rank > 1">
        <Map
          v-if="isMapReady"
          :key="mapKey"
          :radius="map_radius"
          :center_key="center_key"
          :map="map"
          :unit="8"
          @clickRoom="onMapClickRoom"/>
      </div>
      <div v-else>
        <p>You are a rank 1 builder, which means that you don't have access to the whole world map. If you've been assigned a zone, you'll be able to view that zone's map in the zone tab.</p>
        <p v-if="store.state.builder.world.builder_info.builder_assignments.length">Entites assigned to you:</p>
        <ul class='ml-4'>
          <li v-for="assignment in store.state.builder.world.builder_info.builder_assignments" :key="assignment.id">
            <router-link :to="assignment_link(assignment)">
              {{ assignment.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute, RouteLocationRaw } from "vue-router";
import { MAP_CONFIG } from "@/config";
import { get_map_dimensions } from "@/core/map";
import Map from "@/components/ui/Map.vue";
import _ from "lodash";

const store = useStore();
const route = useRoute();

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

const assignment_link = (assignment) => {
  if (assignment.model_type === 'room') {
    return {
      name: 'builder_room_index',
      params: {
        world_id: route.params.world_id,
        room_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'itemtemplate') {
    return {
      name: 'builder_item_template_details',
      params: {
        world_id: route.params.world_id,
        item_template_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'mobtemplate') {
    return {
      name: 'builder_mob_template_details',
      params: {
        world_id: route.params.world_id,
        mob_template_id: assignment.id
      }
    } as RouteLocationRaw;
  }
  // Assume it's a zone
  return {
    name: 'builder_zone_index',
    params: {
      world_id: route.params.world_id,
      zone_id: assignment.id
    }
  } as RouteLocationRaw;
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