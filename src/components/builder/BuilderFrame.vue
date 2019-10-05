<template>
  <div id="builder" v-if="world">
    <!-- Top nav -->
    <div class="builder-nav">
      <!-- World -->
      <router-link
        :to="{ name: 'builder_world_index', params: {world_id: $route.params.world_id}}"
        v-if="$store.state.builder.world"
        :class="{ 'active-context': isWorldView }"
      >
        <span>{{ $store.state.builder.world.name }}</span>
      </router-link>
      <a v-else></a>

      <div class="separator"></div>

      <!-- Zone -->
      <router-link
        :to="{ name: BUILDER_ZONE_INDEX, params: {world_id: $route.params.world_id, zone_id: $store.state.builder.zone.id}}"
        v-if="$store.state.builder.zone"
        :class="{ 'active-context': isZoneView }"
      >
        <span>{{ $store.state.builder.zone.name }}</span>
      </router-link>
      <a v-else></a>

      <div class="separator"></div>

      <!-- Room -->
      <router-link
        :to="{ name: 'builder_room_index', params: {world_id: $route.params.world_id, room_id: $store.state.builder.room.id}}"
        v-if="$store.state.builder.room"
        :class="{ 'active-context': isRoomView }"
      >
        <span>{{ $store.state.builder.room.name }}</span>
      </router-link>
      <a v-else></a>
    </div>

    <!-- Side nav -->
    <div class="builder-contents-outer">
      <div class="side-nav navigation">
        <!-- World nav -->
        <template v-if="isWorldView">
          <router-link
            :to="{name: LOBBY_WORLD_DETAIL, params: {world_id: $route.params.world_id}}"
          >Lobby</router-link>

          <router-link
            :to="{name: BUILDER_ZONE_LIST, params: { world_id: $route.params.world_id}}"
          >Zones</router-link>

          <router-link
            :to="{name: 'builder_mob_template_list', params: {world_id: $route.params.world_id}}"
          >Mobs</router-link>

          <router-link
            :to="{name: 'builder_item_template_list', params: {world_id: $route.params.world_id}}"
          >Items</router-link>

          <router-link
            :to="{name: BUILDER_WORLD_CONFIG, params: {world_id: $route.params.world_id}}"
          >Config</router-link>

          <div class="mobile-hidden">
            <div class="line-divider my-2" />
            <router-link :to="world_status_link">Status</router-link>

            <router-link
              :to="{name: BUILDER_WORLD_BUILDERS, params: {world_id: $route.params.world_id}}"
            >Builders</router-link>

            <router-link
              :to="{name: BUILDER_WORLD_PLAYER_LIST, params: {world_id: $route.params.world_id}}"
            >Players</router-link>

            <router-link :to="world_factions_link">Factions</router-link>
          </div>
        </template>

        <!-- Zone nav -->
        <template v-else-if="isZoneView">
          <router-link
            :to="{name: BUILDER_ZONE_ROOM_LIST, params: { world_id: $route.params.world_id, zone_id: this.$route.params.zone_id}}"
          >Rooms</router-link>

          <router-link
            :to="{name: BUILDER_ZONE_PATH_LIST, params: { world_id: $route.params.world_id, zone_id: this.$route.params.zone_id}}"
          >Paths</router-link>

          <router-link
            :to="{name: BUILDER_ZONE_LOADER_LIST, params: { world_id: $route.params.world_id, zone_id: this.$route.params.zone_id}}"
          >Loads</router-link>

          <router-link
            :to="{name: BUILDER_ZONE_QUEST_LIST, params: { world_id: $route.params.world_id, zone_id: this.$route.params.zone_id}}"
          >Quests</router-link>
        </template>

        <template v-else-if="isRoomView">
          <router-link
            :to="{name: BUILDER_ROOM_LOADS, params: { world_id: $route.params.world_id, room_id: this.$route.params.room_id}}"
          >
            Loads
            <span v-if="room && room.num_loads">({{ room.num_loads}})</span>
          </router-link>

          <router-link
            :to="{name: BUILDER_ROOM_CHECKS, params: { world_id: $route.params.world_id, room_id: this.$route.params.room_id}}"
          >
            Checks
            <span v-if="room && room.num_room_checks">({{ room.num_room_checks}})</span>
          </router-link>

          <router-link
            :to="{name: BUILDER_ROOM_FLAGS, params: { world_id: $route.params.world_id, room_id: this.$route.params.room_id}}"
          >Flags</router-link>
        </template>
      </div>

      <div class="builder-contents">
        <!-- <keep-alive v-if="$store.state.builder.map"> -->
        <!-- <keep-alive> -->
        <router-view :key="$route.fullPath" v-if="$store.state.builder.map"></router-view>
        <!-- </keep-alive> -->
        <div v-else>Loading...</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";
import {
  BUILDER_WORLD_INDEX,
  BUILDER_WORLD_CONFIG,
  BUILDER_WORLD_RANDOM_PROFILES,
  BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST,
  BUILDER_WORLD_BUILDERS,
  BUILDER_WORLD_PLAYER_LIST,
  BUILDER_WORLD_PLAYER_DETAIL,
  BUILDER_WORLD_STATUS,
  BUILDER_ROOM_INDEX,
  BUILDER_ROOM_CHECKS,
  BUILDER_ROOM_LOADS,
  BUILDER_ROOM_PATHS,
  BUILDER_ROOM_CONFIG,
  BUILDER_ROOM_FLAGS,
  BUILDER_ITEM_TEMPLATE_LIST,
  BUILDER_ITEM_TEMPLATE_DETAILS,
  BUILDER_MOB_TEMPLATE_LIST,
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_ZONE_LIST,
  BUILDER_ZONE_INDEX,
  BUILDER_ZONE_ROOM_LIST,
  BUILDER_ZONE_PATH_LIST,
  BUILDER_ZONE_PATH_DETAILS,
  BUILDER_ZONE_LOADER_LIST,
  BUILDER_ZONE_LOADER_DETAILS,
  BUILDER_ZONE_QUEST_LIST,
  BUILDER_ZONE_QUEST_DETAIL,
  BUILDER_TRANSFORMATION_LIST,
  BUILDER_WORLD_FACTIONS,
  LOBBY_WORLD_DETAIL
} from "@/router";

@Component
export default class WorldFrame extends Vue {
  BUILDER_ZONE_LIST: string = BUILDER_ZONE_LIST;
  BUILDER_ZONE_INDEX: string = BUILDER_ZONE_INDEX;
  BUILDER_ZONE_ROOM_LIST: string = BUILDER_ZONE_ROOM_LIST;
  BUILDER_ROOM_CHECKS: string = BUILDER_ROOM_CHECKS;
  BUILDER_ROOM_LOADS: string = BUILDER_ROOM_LOADS;
  BUILDER_ROOM_PATHS: string = BUILDER_ROOM_PATHS;
  BUILDER_ROOM_CONFIG: string = BUILDER_ROOM_CONFIG;
  BUILDER_ROOM_FLAGS: string = BUILDER_ROOM_FLAGS;
  BUILDER_ZONE_PATH_LIST: string = BUILDER_ZONE_PATH_LIST;
  BUILDER_ZONE_LOADER_LIST: string = BUILDER_ZONE_LOADER_LIST;
  BUILDER_ZONE_QUEST_LIST: string = BUILDER_ZONE_QUEST_LIST;
  BUILDER_TRANSFORMATION_LIST: string = BUILDER_TRANSFORMATION_LIST;
  BUILDER_WORLD_CONFIG: string = BUILDER_WORLD_CONFIG;
  BUILDER_WORLD_RANDOM_PROFILES: string = BUILDER_WORLD_RANDOM_PROFILES;
  BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST: string = BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST;
  BUILDER_WORLD_BUILDERS = BUILDER_WORLD_BUILDERS;
  BUILDER_WORLD_PLAYER_LIST = BUILDER_WORLD_PLAYER_LIST;
  LOBBY_WORLD_DETAIL = LOBBY_WORLD_DETAIL;

  get world() {
    return this.$store.state.builder.world;
  }

  async created() {
    // Fetch map
    this.$store.dispatch(
      BUILDER_ACTIONS.FETCH_WORLD_MAP,
      this.$route.params.world_id
    );

    // Fetch world details
    const world = await this.$store.dispatch(
      BUILDER_ACTIONS.FETCH_WORLD,
      this.$route.params.world_id
    );

    if (!this.$store.state.builder.room) {
      const room = world.last_viewed_room;
      this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, room);
      this.$store.commit(BUILDER_MUTATIONS.ZONE_SET, room.zone);
    }
    return world;

    // console.log("getting");
    // await Promise.all([map_promise, world_promise]);
    // console.log("got");
  }

  async destroyed() {
    await this.$store.commit(BUILDER_MUTATIONS.RESET_STATE);
  }

  get room() {
    return this.$store.state.builder.room;
  }

  // A room view is a context composed of most recently viewed
  // room along with its zone.
  get isRoomView() {
    return Boolean(
      this.$store.state.builder.room &&
        (this.$route.name == BUILDER_ROOM_INDEX ||
          this.$route.name == BUILDER_ROOM_CHECKS ||
          this.$route.name == BUILDER_ROOM_LOADS ||
          this.$route.name == BUILDER_ROOM_PATHS ||
          this.$route.name == BUILDER_ROOM_CONFIG ||
          this.$route.name == BUILDER_ROOM_FLAGS)
    );
  }

  get isZoneView() {
    return Boolean(
      this.$store.state.builder.zone &&
        (this.$route.name == BUILDER_ZONE_INDEX ||
          this.$route.name == BUILDER_ZONE_ROOM_LIST ||
          this.$route.name == BUILDER_ZONE_PATH_LIST ||
          this.$route.name == BUILDER_ZONE_PATH_DETAILS ||
          this.$route.name == BUILDER_ZONE_LOADER_LIST ||
          this.$route.name == BUILDER_ZONE_LOADER_DETAILS ||
          this.$route.name == BUILDER_ZONE_QUEST_LIST ||
          this.$route.name == BUILDER_ZONE_QUEST_DETAIL)
    );
  }

  get isWorldView() {
    const WORLD_VIEWS = [
      BUILDER_WORLD_INDEX,
      BUILDER_ITEM_TEMPLATE_LIST,
      BUILDER_MOB_TEMPLATE_LIST,
      BUILDER_MOB_TEMPLATE_DETAILS,
      BUILDER_ITEM_TEMPLATE_DETAILS,
      BUILDER_ZONE_LIST,
      BUILDER_WORLD_CONFIG,
      BUILDER_TRANSFORMATION_LIST,
      BUILDER_WORLD_RANDOM_PROFILES,
      BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST,
      BUILDER_WORLD_BUILDERS,
      BUILDER_WORLD_PLAYER_LIST,
      BUILDER_WORLD_PLAYER_DETAIL,
      BUILDER_WORLD_STATUS,
      BUILDER_WORLD_FACTIONS
    ];
    if (this.$store.state.builder.world)
      for (const routeData of this.$route.matched) {
        const routeName: string | undefined = routeData.name;
        if (routeName && WORLD_VIEWS.includes(routeName)) {
          return true;
        }
      }
    return false;
  }

  get worldId() {
    const world = this.$store.state.builder.world;
    return world ? world.id : null;
  }

  get world_status_link() {
    return {
      name: BUILDER_WORLD_STATUS,
      params: { world_id: this.$route.params.world_id }
    };
  }

  get world_factions_link() {
    return {
      name: BUILDER_WORLD_FACTIONS,
      params: { world_id: this.$route.params.world_id }
    };
  }
}
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

    //background-color: $color-background-light;
    //border-bottom: 1px solid $border-color;

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

    // Navigation
    .side-nav {
      a {
        display: block;
        @include font-title-light;
        font-size: 19px;
        line-height: 30px;
        list-style-type: none;
        color: $color-text-hex-30;

        &:hover {
          color: $color-primary;
        }

        &.router-link-active {
          color: $color-text;
        }

        &.router-link-exact-active:hover {
          text-decoration: none;
          cursor: default;
        }
      }

      @media ($mobile-site) {
        background: $color-background-header;
        display: flex;
        justify-content: space-around;
        flex-shrink: 0;
        padding: 0;

        a {
          padding: 20px 0;
        }
      }
    }

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
