<template>
  <div>
    <h2>{{ world.name.toUpperCase() }} ADMIN</h2>
    <div class="world-status" v-if="world_admin">

      <div>
        <span v-if="world_admin.is_multiplayer">Multiplayer</span>
        <span v-else>Single Player</span>
        World
      </div>

      <div v-if="world_admin.multiplayer_data.main_instance">
        <h3 class="mt-8 mb-2" >MAIN INSTANCE</h3>
        <div>Instance #{{ world_admin.multiplayer_data.main_instance.id }}</div>
        <div>State: {{ world_admin.multiplayer_data.main_instance.state }}</div>
        <div class="actions">
          <button class="btn btn-small start" :disabled="disableStart" @click="onStart">START</button>
          <button class="btn btn-small stop" :disabled="disableStop" @click="onStop">STOP</button>
          <button class="btn btn-small kill" @click="onKill">KILL</button>
        </div>
      </div>

      <!-- <h3 class="mt-8 mb-2" v-else>SINGLE PLAYER WORLD</h3> -->
    </div>
  </div>

  <!-- <component :is="statusComponent"></component> -->
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import StatusMPW from "./StatusMPW.vue";
import StatusSPW from "./StatusSPW.vue";

@Component({
  components: {
    StatusMPW,
    StatusSPW
  }
})
export default class WorldStatus extends Vue {

  async mounted() {
    await this.$store.dispatch(
      'builder/worlds/world_admin_fetch',
      this.$route.params.world_id);
  }

  get world() {
    return this.$store.state.builder.world;
  }

  get world_admin() {
    return this.$store.state.builder.worlds.world_admin;
  }

  get statusComponent() {
    if (this.$store.state.builder.world.is_multiplayer) {
      return StatusMPW;
    }
    return StatusSPW;
  }

  get disableStart() {
    return this.world_admin.multiplayer_data.main_instance.state === 'running';
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>