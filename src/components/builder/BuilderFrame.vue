<template>
  <div id="builder" v-if="world">
    <!-- Top nav -->
    <div class="builder-nav">
      <!-- World -->
      <router-link v-if="world" :class="{ 'active-context': (viewType === 'world') }" :to="{ name: 'builder_world_index', params: {world_id: worldId}}">
        <span>{{ world.name }}</span>
      </router-link>
      <a v-else></a>

      <div class="separator"></div>

      <!-- Zone -->
      <router-link v-if="zone" :class="{ 'active-context': (viewType === 'zone') }" :to="{ name: 'builder_zone_index', params: {world_id: worldId, zone_id: zone.id}}">
        <span>{{ zone.name }}</span>
      </router-link>
      <a v-else></a>

      <div class="separator"></div>

      <!-- Room -->
      <router-link v-if="room" :class="{ 'active-context': (viewType === 'room') }" :to="{ name: 'builder_room_index', params: {world_id: route.params.world_id, room_id: room.id}}">
        <span>{{ room.name }}</span>
      </router-link>
      <a v-else></a>
    </div>

    <!-- Side nav -->
    <div class="builder-contents-outer">
      <div class="side-nav navigation">
        <!-- World nav -->
        <template v-if="viewType === 'world'">
          <router-link
            :to="{name: 'lobby_world_details', params: {world_id: route.params.world_id}}"
          >Lobby</router-link>

          <router-link
            :to="{name: 'builder_zone_list', params: { world_id: route.params.world_id}}"
          >Zones</router-link>

          <router-link
            :to="{name: 'builder_mob_template_list', params: {world_id: route.params.world_id}}" :class="{ 'router-link-active': isWorldMobsRoute }"
          >Mobs</router-link>

          <router-link
            :to="{name: 'builder_item_template_list', params: {world_id: route.params.world_id}}" :class="{ 'router-link-active': isWorldItemsRoute }"
          >Items</router-link>

          <router-link
            :to="{name: 'builder_world_config', params: {world_id: route.params.world_id}}" :class="{ 'router-link-active': isWorldConfigRoute }"
          >Config</router-link>

          <div class="mobile-hidden">
            <div class="line-divider my-2"></div>
            <router-link :to="world_admin_link" :class="{ 'router-link-active' :isWorldAdminRoute }">Admin</router-link>

            <router-link
              :to="{name: 'builder_world_builder_list', params: {world_id: route.params.world_id}}"
            >Builders</router-link>

            <router-link
              :to="{name: 'builder_world_player_list', params: {world_id: route.params.world_id}}"
            >Players</router-link>

            <router-link :to="world_factions_link">Factions</router-link>
          </div>
        </template>

        <!-- Zone nav -->
        <template v-else-if="viewType === 'zone'">
          <router-link
            :to="{name: 'builder_zone_room_list', params: { world_id: $route.params.world_id, zone_id: route.params.zone_id}}"
          >Rooms</router-link>

          <router-link
            :to="{name: 'builder_zone_path_list', params: { world_id: $route.params.world_id, zone_id: route.params.zone_id}}" :class="{ 'router-link-active': isZonePathRoute }"
          >Paths</router-link>

          <router-link
            :to="{name: 'builder_zone_loader_list', params: { world_id: $route.params.world_id, zone_id: route.params.zone_id}}" :class="{ 'router-link-active': isZoneLoadsRoute }"
          >Loads</router-link>

          <router-link
            :to="{name: 'builder_zone_quest_list', params: { world_id: $route.params.world_id, zone_id: route.params.zone_id}}" :class="{ 'router-link-active': isZoneQuestsRoute }"
          >Quests</router-link>

          <router-link
            :to="{name: 'builder_zone_config', params: { world_id: $route.params.world_id, zone_id: route.params.zone_id}}" :class="{ 'router-link-active': isZoneConfigRoute }"
          >Config</router-link>
        </template>

        <!-- Room nav -->
        <template v-else-if="viewType === 'room'">
          <router-link
            :to="{name: 'builder_room_load_list', params: { world_id: $route.params.world_id, room_id: route.params.room_id}}"
          >
            Loads
            <span v-if="room && room.num_loads">({{ room.num_loads}})</span>
          </router-link>

          <router-link
            :to="{name: 'builder_room_check_list', params: { world_id: $route.params.world_id, room_id: route.params.room_id}}"
          >
            Checks
            <span v-if="room && room.num_room_checks">({{ room.num_room_checks}})</span>
          </router-link>

          <router-link :to="{name: 'builder_room_action_list', params: { world_id: $route.params.world_id, room_id: route.params.room_id }}">
            Actions
            <span v-if="room && room.num_actions">({{ room.num_actions }})</span>
          </router-link>

          <router-link
            :to="{name: 'builder_room_flags', params: { world_id: $route.params.world_id, room_id: route.params.room_id}}"
          >Flags</router-link>

          <router-link
            :to="{name: 'builder_room_details_list', params: { world_id: $route.params.world_id, room_id: route.params.room_id}}"
          >
            Details
            <span
              v-if="room && room.details && room.details.length"
            >({{ room.details.length }})</span>
          </router-link>
        </template>
      </div>

      <div class="builder-contents">
        <!-- <keep-alive v-if="$store.state.builder.map"> -->
        <!-- <keep-alive> -->
        <router-view :key="route.fullPath" v-if="map"></router-view>
        <!-- </keep-alive> -->
        <div v-else>Loading...</div>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const world = computed(() => store.state.builder.world);
const worldId = computed(() => route.params.world_id);
const room = computed(() => store.state.builder.room);
const zone = computed(() => store.state.builder.zone);
const map = computed(() => store.state.builder.map);
const world_admin_link = computed(() => {
    return {
      name: 'builder_world_admin',
      params: { world_id: route.params.world_id },
    };
});
const world_factions_link = computed(() => {
  return {
    name: 'builder_world_faction_list',
    params: { world_id: route.params.world_id },
  };
});

onMounted(async () => {
  store.dispatch(
    'builder/fetch_world_map',
    route.params.world_id)

  const world = await store.dispatch(
    'builder/fetch_world',
    route.params.world_id
  );

  if (!store.state.builder.room) {
    const room = world.last_viewed_room;
    store.commit('builder/room_set', room);
    store.commit('builder/zone_set', room.zone);
  }

  return world;

});

onUnmounted(async () => {
  await store.commit('builder/reset_state');
});

const viewType = computed(() => {
  const roomRegex = /^\/build\/worlds\/\d+\/rooms\/\d+/;
  if (store.state.builder.room && roomRegex.test(route.fullPath)) {
    return 'room';
  }
  const zoneRegex = /^\/build\/worlds\/\d+\/zones\/\d+.*/;
  if (store.state.builder.zone && zoneRegex.test(route.fullPath)) {
    return 'zone';
  }
  return 'world';
});

/* Active route checks */
// World
const isWorldItemsRoute = computed(() => { return route.name === 'builder_item_template_details'; });
const isWorldMobsRoute = computed(() => { return route.name === 'builder_mob_template_details'; });
const isWorldConfigRoute = computed(() => {
  const routes = [
    'builder_world_random_profile_list',
    'builder_world_transformation_template_list',
    'builder_world_fact_list',
    'builder_world_skill_list',
    'builder_world_starting_eq_list',
  ];
  return routes.includes(route.name as string);
});
const isWorldAdminRoute = computed(() => { return route.name === 'builder_world_admin_instance'; });
// Zone
const isZonePathRoute = computed(() => { return route.name === 'builder_zone_path_details'; });
const isZoneLoadsRoute = computed(() => { return route.name === 'builder_zone_loader_details'; });
const isZoneQuestsRoute = computed(() => { return route.name === 'builder_zone_quest_details'; });
const isZoneConfigRoute = computed(() => { return route.name === 'builder_zone_procession_list'; });
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#builder {
  display: flex;
  flex-direction: column;

  .builder-nav {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;

    flex-shrink: 0;

    // http://stackoverflow.com/questions/6250394/how-to-increase-space-between-dotted-border-dots
    background-image: linear-gradient(
      to right,
      #444 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: bottom;
    background-size: 3px 1px;
    background-repeat: repeat-x;

    @media ($desktop-site) {
      min-height: 50px;
    }

    > a {
      color: $color-text-hex-30;
      font-weight: 300;
      display: flex;
      padding: 10px;
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      justify-content: center;
      align-items: center;
      text-align: center;

      &.router-link-exact-active,
      &.active-context {
        color: $color-text;
      }

      @media ($desktop-site) {
        padding: 15px;
      }
    }

    .separator {
      display: flex;
      flex-direction: column;
      justify-content: center;

      // Create the thin right-headed arrows

      width: 15px;
      //height: 50px;
      position: relative;

      $arrow-color: $color-text-hex-30;
      $arrow-height: 15px; // *2
      $arrow-width: 10px;

      // Create two triangles
      &:after,
      &:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        border-color: transparent;
        border-left-width: $arrow-width;
        border-top-width: $arrow-height;
        border-bottom-width: $arrow-height;
      }

      // Offset one by 1 pixel to the left with the same
      // background as the page to make it look thin
      &:before {
        border-left-color: $arrow-color;
        left: 1px;
      }
      &:after {
        border-left-color: $color-background;
      }
    }
  }

  .builder-contents-outer {
    display: flex;
    flex-grow: 1;

    /* Responsive nav set */
    @media ($desktop-site) {
      flex-direction: row;

      .side-nav {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        padding: 15px 10px 15px 25px;
        width: 150px;
      }
    }

    .builder-contents {
      flex-grow: 1;
      display: flex;
      -webkit-overflow-scrolling: touch;
    }

    @media ($mobile-site) {
      flex-direction: column;

      .builder-contents {
        order: 1;
      }
      .side-nav {
        order: 2;
      }
    }
    /* End Responsive nav set */

    .builder-contents {
      padding: 15px;
      flex-grow: 1;

      @media ($mobile-site) {
        overflow-y: auto;
      }

      .entity-title {
        font-size: 24px;
        margin-bottom: 10px;
      }
    }
  }

  .line-divider {
    width: 60%;
  }
}
</style>
