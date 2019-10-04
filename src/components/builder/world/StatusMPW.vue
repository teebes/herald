<template>
  <div>
    <h2>{{ world.name.toUpperCase() }} STATUS</h2>

    <div v-if="admin_data">
      <h3 class="mt-8 mb-2">MULTI PLAYER WORLD</h3>

      <div>{{ admin_data.api_num_players }} player characters</div>

      <div class="mt-4">API state: {{ admin_data.api_state }}</div>
      <div>API loaded mobs: {{ admin_data.api_mob_count }}</div>
      <div>API loaded items: {{ admin_data.api_item_count }}</div>
      <div>
        API online players:
        <br />
        <ul v-if="admin_data.api_online_players.length" class="list">
          <li v-for="player in admin_data.api_online_players" :key="player.id">{{ player.name }}</li>
        </ul>
        <span v-else>none.</span>
      </div>

      <div class="mt-4"></div>
      <div>Game state: {{ admin_data.game_state }}</div>
      <div>Game loaded mobs: {{ admin_data.game_mob_count }}</div>
      <div>Game loaded items: {{ admin_data.game_item_count }}</div>
      <div>
        Game Players online:
        <br />
        <ul v-if="admin_data.game_players.length" class="list">
          <li v-for="player in admin_data.game_players" :key="player.id">{{ player.name }}</li>
        </ul>
        <span v-else>none.</span>
      </div>

      <div class="actions">
        <button class="btn btn-small start" :disabled="disableStart" @click="onStart">START</button>
        <button class="btn btn-small stop" :disabled="disableStop" @click="onStop">STOP</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/WorldView.ts";
import axios from "axios";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class StatusMPW extends Mixins(WorldView) {
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
    }, 10000);
  }

  destroyed() {
    clearInterval(this.interval);
  }

  get disableStart() {
    if (!this.admin_data || this.action_submitted) return true;
    return this.admin_data.api_state != "stopped";
  }

  get disableStop() {
    if (!this.admin_data || this.action_submitted) return true;
    return this.admin_data.api_state != "running";
  }

  async onStart() {
    this.action_submitted = true;
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      notification: "Starting world, this may take a minute...",
      expires: false
    });
    const resp = await axios.post(`/builder/worlds/${this.world.id}/start/`);
    this.admin_data = resp.data;
    this.action_submitted = false;
  }

  async onStop() {
    this.action_submitted = true;
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      notification: "Stopping world, this may take a minute...",
      expires: false
    });
    const resp = await axios.post(`/builder/worlds/${this.world.id}/stop/`);
    this.admin_data = resp.data;
    this.action_submitted = false;
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