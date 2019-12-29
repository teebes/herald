<template>
  <div id="page">
    <h1>Staff Panel</h1>
    <div>
      <!-- <div class="stats">
        <h2>Stats</h2>
      </div>-->

      <div class="root-worlds-and-player-events">
        <div class="root-worlds horizontal-list">
          <div class="horizontal-list-header">
            <h2>Root Worlds</h2>
          </div>
          <div class="root-world horizontal-list-item" v-for="world in root_worlds" :key="world.id">
            <h3>{{ world.name }}</h3>
            <div>
              <span v-if="world.is_multiplayer">Multiplayer</span>
              <span v-else>Singleplayer</span>
            </div>
            <div>{{ world.num_rooms }} rooms</div>
            <div>{{ world.num_players }} players</div>
            <div>
              By user {{ world.author.id }}
              {{ world.author_email }} ({{ world.author.name }})
            </div>
            <router-link :to="world_link(world.id)">Edit World</router-link>
          </div>
        </div>

        <div class="player-events horizontal-list">
          <div class="horizontal-list-header">
            <h2>Player Events</h2>
          </div>
          <div
            class="player-event horizontal-list-item"
            v-for="event in player_events"
            :key="event.id"
          >
            <h3>{{ event.player.name }}</h3>
            <div v-if="!event.user.is_temporary">{{ event.user.email }}</div>
            <div>{{ event.user.name }}</div>
            <div>{{ event.event }} - {{ event.world.name }}</div>
            <div>{{ event.created_ts }}</div>
            <div>
              <router-link :to="player_link(event.root_world_id, event.player.id)">View Player</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import axios from "axios";
import { BUILDER_WORLD_INDEX, BUILDER_WORLD_PLAYER_DETAIL } from "@/router.ts";

@Component({
  components: {
    ElementList
  }
})
export default class StaffPage extends Vue {
  root_worlds: {}[] = [];
  player_events: {}[] = [];

  async created() {
    const root_worlds_promise = axios.get("/staff/worlds/?page_size=50");
    const player_events_promise = axios.get("/staff/playerevents?page_size=50");

    const [root_worlds_resp, player_events_resp] = await Promise.all([
      root_worlds_promise,
      player_events_promise
    ]);
    this.root_worlds = root_worlds_resp.data.results;
    this.player_events = player_events_resp.data.results;
  }

  world_link(world_id) {
    return {
      name: BUILDER_WORLD_INDEX,
      params: { world_id: world_id }
    };
  }

  player_link(world_id, player_id) {
    return {
      name: BUILDER_WORLD_PLAYER_DETAIL,
      params: { world_id, player_id }
    };
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

h1,
h2,
h3 {
  text-transform: uppercase;
}

.root-worlds-and-player-events {
  display: flex;
  flex-direction: row;
  margin-top: 40px;

  @media ($mobile-site) {
    flex-direction: column;
    margin-top: 0px;
    .player-events {
      order: 1;
      margin-top: 20px;
    }
    .root-worlds {
      order: 2;
      margin-top: 20px;
    }
  }

  .root-worlds {
    margin-right: 1rem;
    flex: 2;
  }
  .player-events {
    margin-left: 1rem;
    flex: 1;
  }

  .root-world,
  .player-event {
    // border-top: 1px solid $color-text-hex-30;
    // padding: 15px;
  }
}
</style>