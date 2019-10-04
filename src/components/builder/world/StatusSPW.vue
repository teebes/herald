<template>
  <div>
    <h2>{{ world.name.toUpperCase() }} STATUS</h2>

    <div v-if="admin_data">
      <h3 class="mt-8 mb-2">SINGLE PLAYER WORLD</h3>
      <div>{{ admin_data.spawn_world_count }} instances created ( {{ admin_data.online_world_count }} online).</div>

      <template v-if="admin_data && admin_data.worlds.length">
        <h3 class="mt-8">ONLINE INSTANCES</h3>

        <div class="mt-4" v-for="world_data in admin_data.worlds" :key="world_data.id">
          <!-- player summary -->
          <div
            v-if="world_data.api_online_players[0]"
          >{{ world_data.api_online_players[0].name.toUpperCase() }} (level {{ world_data.api_online_players[0].level }})</div>
          <div v-else>No player data.</div>
          <!-- world data -->
          <div>API: {{ world_data.api_state }} - {{ world_data.api_mob_count }} mobs, {{ world_data.api_item_count }} items</div>
          <div>Game: {{ world_data.game_state }} - {{ world_data.game_mob_count }} mobs, {{ world_data.game_item_count }} items</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/WorldView.ts";
import axios from "axios";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class StatusSPW extends Mixins(WorldView) {
  admin_data: any = null;
  interval: any;

  // Will be set to true when either the stop or the stop button have just been
  // clicked. Will avoid subsequent actions before the next update_data
  // fires off.
  action_submitted: boolean = false;

  get world() {
    return this.$store.state.builder.world;
  }

  async update_data() {
    if (this.action_submitted) return;
    const world_id = this.world.id;
    const resp = await axios.get(`/builder/worlds/${this.world.id}/admin/`);
    this.admin_data = resp.data;
  }

  async mounted() {
    this.update_data();
    this.interval = setInterval(() => {
      this.update_data();
    }, 3000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.actions {
  margin-top: 1rem;
}

button.stop {
  margin-left: 1rem;
}
</style>