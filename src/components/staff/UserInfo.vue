<template>
  <div v-if="user" id="page">
    <h1>
      {{ user.name }}
      <span class="color-text-70 ml-4">[ {{ user.id }} ]</span>
    </h1>

    <div class="info">
      <h2>Basic Info</h2>
      <div>Email: {{ user.email }}</div>
      <div>Date joined: {{ user.date_joined }}</div>
      <div>Last login: {{ user.last_login }}</div>
      <div>Send newsletter: {{user.send_newsletter}}</div>
      <div>{{ user.players_count }} player characters</div>
    </div>

    <div class="recent-logins">
      <h2>Recent Logins</h2>
      <div v-for="event in user.events" :key="event.created_ts">
        <span class="color-text-70 mr-1">{{ event.created_ts }}</span>
        {{ event.event }}
        <router-link
          :to="player_link(event.player, event.world)"
          class="mr-1"
        >{{ event.player.name }}</router-link>on
        <router-link :to="world_link(event.world)">{{ event.world.name }}</router-link>
      </div>
    </div>

    <div>
      <h2>Worlds</h2>
      <table class="worlds-table">
        <tbody>
          <tr v-for="world in user.worlds" :key="world.id">
            <td>
              <router-link :to="world_link(world)">{{ world.name }}</router-link>
            </td>
            <td class="color-text-70 num-rooms">{{ world.num_rooms }} rooms</td>
            <td class="color-text-70">{{ world.num_players }} players</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>Players</h2>
      <table class="players-table">
        <tbody>
          <tr v-for="player in user.players" :key="player.id">
            <td>
              <router-link :to="player_link(player)">{{ player.name }}</router-link>
            </td>
            <td class="player-room">
              <router-link :to="world_link(player.world_id)">{{ player.world_name }}</router-link>
            </td>
            <td class="player-last-connection-ts color-text-70">{{ player.last_connection_ts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import { BUILDER_WORLD_PLAYER_DETAIL, BUILDER_WORLD_INDEX } from "@/router";

@Component
export default class UserInfo extends Vue {
  user: {} | null = null;

  async mounted() {
    const resp = await axios.get(`/staff/users/${this.$route.params.user_id}`);
    this.user = resp.data;
    console.log(this.user);
  }

  world_link(world) {
    return {
      name: BUILDER_WORLD_INDEX,
      params: {
        world_id: world.id
      }
    };
  }

  player_link(player, world) {
    let world_id;
    if (world) {
      world_id = world.id;
    } else {
      world_id = player.world_id;
    }
    return {
      name: BUILDER_WORLD_PLAYER_DETAIL,
      params: {
        world_id: player.world_id,
        player_id: player.id
      }
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

h1 {
  margin: 1em 0;
}

h2 {
  margin-top: 1em;
}

.recent-logins {
  font-family: monospace;
}

.worlds-table {
  .num-rooms {
    padding: 0 20px;
  }
}

.players-table {
  .player-room {
    padding: 0 20px;
  }
  .player-last-connection-ts {
    font-family: monospace;
  }
}
</style>