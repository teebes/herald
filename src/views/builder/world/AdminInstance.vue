<template>
  <div v-if="instance">
    <h2>{{ root_world.name.toUpperCase() }} INSTANCE #{{ instance.id }}</h2>

    <div class="mt-2">Last state change: {{ instance.change_state_ts }}</div>
    <div v-if="instance.live_data && instance.live_data.ref">
      Instance ref: {{ instance.live_data.ref}}
    </div>

    <!-- Forge Data -->
    <div class="forge-data mt-4">
      <h3 class="mb-2">FORGE DATA</h3>

      <div>Forge State: {{ instance.state }}</div>
      <div>Player Count: {{ instance.forge_data.num_players }}</div>
      <div>Item Count: {{ instance.forge_data.num_items }}</div>
      <div>Items Pending Deletion Count: {{ instance.forge_data.num_pending_items }}</div>
      <div>Mob Count: {{ instance.forge_data.num_mobs }}</div>
    </div>

    <!-- Live Data -->
    <div class="live-data mt-4">
      <h3 class="mb-2">LIVE DATA</h3>

      <div>
        <div>Game State: {{ instance.live_data.state }}</div>
        <div>Leader: {{ instance.live_data.leader_id }}</div>
        <div>{{ instance.live_data.num_items }} items</div>
        <div>{{ instance.live_data.num_mobs }} mobs</div>

        <!-- Players -->
        <div v-if="!instance.live_data.connected_players.length">No online players.</div>
        <div v-else>
          <div>Players:</div>
          <div v-for="player in instance.live_data.connected_players" v-bind:key="player.id">
            [ <router-link :to="player_link(player)">{{ player.id }}</router-link> ] {{ player.name }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const root_world = computed(() => store.state.builder.world);
const instance = computed(() => store.state.builder.worlds.admin.admin_instance);

onMounted(() => {
  store.dispatch('builder/worlds/admin/world_admin_instance_fetch', {
    'world_id': store.state.builder.world.id,
    'instance_id': route.params.instance_id,
  });
});

const player_link = (player: any) => {
  return {
    name: 'builder_world_player_details',
    params: {
      world_id: store.state.builder.world.id,
      player_id: player.id,
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>