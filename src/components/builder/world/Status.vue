<template>
  <div>
    <h2>{{ root_world.name.toUpperCase() }} ADMIN</h2>
    <div class="world-status" v-if="world_admin">

      <div class="color-text-50">
        <span v-if="world_admin.is_multiplayer">Multiplayer</span>
        <span v-else>Single Player</span>
        World
      </div>

      <!-- Maintenance Box -->
      <div class="maintenance panel mt-4">
        <div class="maintenance-status mb-2">
          Maintenance mode:
          <span v-if="root_world.maintenance_mode">ON</span>
          <span v-else>OFF</span>
          <Help help="A world in maintenance mode cannot be entered by players."/>
        </div>

        <div class="form-group">
          <input type="text" placeholder="Maintenance Message" v-model="maintenance_msg">
        </div>

        <div class="slider-container">
          <Slider
            :value="root_world.maintenance_mode"
            @change="onSliderChange"/>
          </div>
        </div>
      </div>

      <!-- Nexus tracker -->
      <div v-if="world_admin && world_admin.nexus_data">
        Nexus ready:
        <span v-if="world_admin.nexus_data.is_ready">Yes</span>
        <span v-else>No - {{ world_admin.nexus_data.error }}</span>
      </div>

      <div v-if="main">
        <h3 class="mt-8 mb-2" >MAIN INSTANCE</h3>
        <div>Instance #{{ main.id }}</div>
        <div>State: {{ main.state }} <span v-if="main.is_clean">- clean</span></div>
        <div class="actions mt-2">
          <button class="btn btn-small start" :disabled="disableStart(main)" @click="onStart(main)">START</button>
          <button class="btn btn-small stop ml-2" :disabled="disableStop(main)" @click="onStop(main)">STOP</button>
          <button class="btn btn-small kill ml-2" :disabled="disableKill(main)" @click="onKill(main)">KILL</button>
        </div>
      </div>

      <div v-if="spws">
        <div v-for="spw in spws" v-bind:key="spw.id">
          {{ spw.id }}
        </div>
      </div>

    </div>
  </div>

</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { UI_MUTATIONS } from "@/constants";
import Slider from "@/components/forms/Slider.vue";
import Help from "@/components/Help.vue";
import axios from "axios";

@Component({
  components: {
    Slider, Help
  }
})
export default class WorldStatus extends Vue {

  // Index of which worlds have an action that was just fired off, so that we
  // can disable the other actions in order not to spam the server.
  action_submitted: {} = {};

  maintenance_msg: string = '';

  async created() {

    this.maintenance_msg = this.root_world.maintenance_msg;

    /* Subscribe to updates from the Forge for this world */
    if (!this.$store.state.ui.forge_ws) {
      await this.$store.dispatch('ui/connect_forge_ws');
    }

    if (this.$store.state.ui.forge_ws) {
      await this.$store.dispatch('ui/send_forge_ws', {
        'type': 'sub',
        'subscription': 'builder.admin',
        'world_id': this.root_world.id,
      })
    }

    await this.$store.dispatch(
      'builder/worlds/world_admin_fetch',
      this.$route.params.world_id);
  }

  async destroyed() {
    await this.$store.dispatch('ui/send_forge_ws', {
      'type': 'unsub',
      'subscription': 'builder.admin',
      'world_id': this.root_world.id,
    })
  }

  get root_world() {
    return this.$store.state.builder.world;
  }

  // The main MPW instance
  get main() {
    return this.world_admin.multiplayer_data.main_instance;
  }

  // The Single Player World instances
  get spws() {
    console.log('spws:')
    console.log(this.world_admin.singleplayer_data.running_instances);
    return this.world_admin.singleplayer_data.running_instances;
  }

  get world_admin() {
    return this.$store.state.builder.worlds.world_admin;
  }

  disableStart(instance) {
    if (!this.world_admin || this.action_submitted[instance.id]) return true;
    return instance.state === 'running';
  }

  disableStop(instance) {
    if (!this.world_admin || this.action_submitted[instance.id]) return true;
    return instance.state != 'running';
  }

  disableKill(instance) {
    if (!this.world_admin || this.action_submitted[instance.id]) return true;
    return false
  }

  async onStart(instance) {
    this.action_submitted[instance.id] = true;
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Starting world, this may take a minute...",
      expires: false
    });
    await this.$store.dispatch(
      'builder/worlds/world_admin_start',
      this.$route.params.world_id);

    this.action_submitted[instance.id] = false;
  }

  async onStop(instance) {
    this.action_submitted[instance.id] = true;
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Stopping world, this may take a minute...",
      expires: false
    });
    await this.$store.dispatch(
      'builder/worlds/world_admin_stop',
      this.$route.params.world_id);
    this.action_submitted[instance.id] = false;
  }

  async onKill(instance) {
    this.action_submitted[instance.id] = true;
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Killing...",
      expires: false
    });
    await this.$store.dispatch(
      'builder/worlds/world_admin_kill',
      this.$route.params.world_id);
    this.action_submitted[instance.id] = false;
  }

  async onSliderChange(newValue: boolean) {
    console.log('slider changed to', newValue);
    await this.$store.dispatch(
      'builder/world_patch',
      {
        maintenance_mode: newValue,
        maintenance_msg: this.maintenance_msg,
      });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.world-status {
  width: 100%;
  .maintenance {
    width: 100%;
    max-width: 600px;
    .slider-container {
      transform: scale(0.8);
      transform-origin: top left;
    }
  }
}
</style>