<template>
  <div v-if="instance">
    <h2>{{ root_world.name.toUpperCase() }} INSTANCE #{{ instance.id }}</h2>

    <!-- Forge Data -->
    <div class="forge-data mt-4">
      <h3 class="mb-2">FORGE DATA</h3>

      <div>Forge State: {{ instance.state }}</div>
      <div>Player Count: {{ instance.forge_data.num_players }}</div>
      <div>Item Count: {{ instance.forge_data.num_items }}</div>
      <div>Mob Count: {{ instance.forge_data.num_mobs }}</div>
    </div>

    <!-- Live Data -->
    <div class="live-data mt-4">
      <h3 class="mb-2">LIVE DATA</h3>

      <div>
        <div>Game State: {{ instance.live_data.state }}</div>
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

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { BUILDER_WORLD_PLAYER_DETAIL } from "@/router.ts";

@Component
export default class extends Vue {

  get root_world() {
    return this.$store.state.builder.world;
  }

  get instance() {
    console.log('instance:', this.$store.state.builder.worlds.admin.admin_instance);
    return this.$store.state.builder.worlds.admin.admin_instance;
  }

  async created() {
    await this.$store.dispatch('builder/worlds/admin/world_admin_instance_fetch', {
      'world_id': this.$store.state.builder.world.id,
      'instance_id': this.$route.params.instance_id,
    })
  }

  player_link(player) {
    return {
      name: BUILDER_WORLD_PLAYER_DETAIL,
      params: {
        world_id: this.$store.state.builder.world.id,
        player_id: player.id,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>