<template>
  <div v-if="user" id="page">
    <h1>
      {{ user.name || "Anonymous User"}}
      <span class="color-text-70 ml-4">[ {{ user.id }} ]</span>
    </h1>

    <div class="info">
      <h2>Basic Info</h2>
      <div>
        Email: {{ user.email }}
        <span v-if="user.is_confirmed">[ confirmed ]</span>
        <span v-if="user.is_invalid">[ invalid ]</span>
        <span v-else-if="!user.is_confirmed">[ unconfirmed ]</span>
      </div>
      <div>First name: {{ user.first_name || "None set" }}</div>
      <div>Last name: {{ user.last_name || "None set" }}</div>
      <div>Username: {{ user.name || "None set"}}</div>
      <div>Date joined: {{ user.date_joined }}</div>
      <div>Last login: {{ user.last_login }}</div>
      <div>Send newsletter: {{user.send_newsletter}}</div>
      <div>{{ user.players_count }} player characters</div>

      <div v-if="!user.is_confirmed && !user.is_invalid" class="mt-2">
        <button class="btn-small" @click="invalidate_email">INVALIDATE EMAIL</button>
      </div>

    </div>

    <div class="recent-logins">
      <h2>Recent Logins</h2>
      <div v-for="event in user.events" :key="event.created_ts">
        <span class="color-text-70 mr-1">{{ event.created_ts }}</span>
        {{ event.event }}
        <router-link
          :to="player_link(event.player)"
          class="mr-1"
        >{{ event.player.name }}</router-link>on
        <router-link :to="world_link(event.world.context_id)">{{ event.world.name }}</router-link>
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
              <router-link :to="world_link(player.root_world_id)">{{ player.world_name }}</router-link>
            </td>
            <td class="player-last-connection-ts color-text-70">{{ player.last_connection_ts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';


const store = useStore();
const route = useRoute();

onMounted(() => {
  store.dispatch('staff/user_fetch', route.params.user_id);
});

const user = computed(() => store.state.staff.user);

const world_link = (world_id: number) => {
  return {
    name: 'builder_world_index',
    params: {
      world_id: world_id
    }
  };
};
const player_link = (player: any) => {
  return {
    name: 'builder_world_player_details',
    params: {
      world_id: player.root_world_id,
      player_id: player.id
    }
  };
};
const invalidate_email = () => {
  store.dispatch('staff/invalidate', route.params.user_id);
};
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