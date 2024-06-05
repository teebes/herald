<template>
  <div v-if="world_admin.id">
    <h2>{{ root_world.name.toUpperCase() }} ADMIN</h2>
    <div class="world-status">

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
          <Help help="Players cannot enter a world in maintenance (but builders can)."/>
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
      <div v-if="world_admin && world_admin.nexus_data" class="color-text-50 mt-1">
        Nexus ready:
        <span v-if="world_admin.nexus_data.is_ready">Yes</span>
        <span v-else>No</span>
        <span v-if="world_admin.nexus_data.error">- {{ world_admin.nexus_data.error }}</span>
      </div>

      <!-- Main MPW Instance -->
      <div v-if="main_mpw">
        <h3 class="mt-8 mb-2" >MAIN INSTANCE</h3>
        <div>Instance #<router-link :to="admin_instance_link(main_mpw.id)">{{ main_mpw.id }}</router-link></div>
        <div>
          State: {{ main_mpw.state }} / {{ main_mpw.game_state }}
          <!-- <span v-if="main.is_clean">- clean</span> -->
        </div>
        <div class="actions mt-2">
          <button class="btn btn-small start" :disabled="disableStart(main_mpw)" @click="onStart(main_mpw)">START</button>
          <button class="btn btn-small stop ml-2" :disabled="disableStop(main_mpw)" @click="onStop(main_mpw)">STOP</button>
          <button class="btn btn-small kill ml-2" :disabled="disableKill(main_mpw)" @click="onKill(main_mpw)">KILL</button>
        </div>
      </div>

      <!-- SPW Instances -->
      <div v-if="spws && world_admin.spw_data.total_count">
        <h3 class="mt-8 mb-2" >SINGLE PLAYER INSTANCES</h3>
        <div>Total SPW instances: {{ world_admin.spw_data.total_count }}</div>
        <div v-for="spw in spws" v-bind:key="spw.id">
          [ {{ spw.id }} ] {{  spw.player_name }} <button class="btn btn-small kill ml-2" @click="onKill(spw)">KILL</button>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="world_admin && world_admin.stats" class="mt-8">
        <h3 class="mb-2">STATS</h3>
        <div>Rooms: {{ world_admin.stats.num_rooms }}</div>
        <div>Mob Templates: {{ world_admin.stats.num_mob_templates }}</div>
        <div>Item Templates: {{ world_admin.stats.num_item_templates }}</div>
      </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Slider from "@/components/forms/Slider.vue";
import Help from "@/components/Help.vue";

const store = useStore();
const route = useRoute();

// Index of which worlds have an action that was just fired off, so that we
// can disable the other actions in order not to spam the server.
const action_submitted = ref({});
const maintenance_msg = ref('');

const root_world: any = computed(() => store.state.builder.world);
const world_admin = computed(() => store.state.builder.worlds.admin.world_admin);
// The main MPW instance
const main_mpw = computed(() => world_admin.value.mpw_data.main_instance);
const spws = computed(() => world_admin.value.spw_data.running_spws);

onMounted(async () => {
  maintenance_msg.value = root_world.maintenance_msg;

  await store.dispatch('forge/send', {
    'type': 'sub',
    'sub': 'builder.admin',
    'world_id': root_world.value.id,
  });

  await store.dispatch(
    'builder/worlds/admin/world_admin_fetch',
    route.params.world_id);

});

onUnmounted(async () => {
  await store.dispatch('forge/send', {
    'type': 'unsub',
    'sub': 'builder.admin',
    'world_id': route.params.world_id,
  })
});

const admin_instance_link = (instance_id) => {
  return {
    name: 'builder_world_admin_instance',
    params: {
      world_id: route.params.world_id,
      instance_id: instance_id,
    }
  }
};

const disableStart = (instance) => {
  if (!world_admin || action_submitted.value[instance.id]) return true;
  return instance.state != 'stored';
};

const disableStop = (instance) => {
  if (!world_admin || action_submitted.value[instance.id]) return true;
  return instance.state != 'running';
};

const disableKill = (instance) => {
  if (!world_admin || action_submitted.value[instance.id]) return true;
  return false
};

const onStart = async (instance) => {
  action_submitted.value[instance.id] = true;
  store.commit('ui/notification_set', {
    text: "Starting world, this may take a minute...",
    expires: false
  });

  await store.dispatch('forge/send', {
    'type': 'job',
    'job': 'start_world',
    'world_id': instance.id,
  });
  action_submitted.value[instance.id] = false;
};

const onStop = async (instance) => {
  action_submitted.value[instance.id] = true;
  store.commit('ui/notification_set', {
    text: "Stopping world, this may take a minute...",
    expires: false
  });

  await store.dispatch('forge/send', {
    'type': 'job',
    'job': 'stop_world',
    'world_id': instance.id,
  });
  action_submitted.value[instance.id] = false;
};


const onKill = async (instance) => {
  action_submitted.value[instance.id] = true;
  store.commit('ui/notification_set', {
    text: "Killing...",
    expires: false
  });

  await store.dispatch('forge/send', {
    'type': 'job',
    'job': 'kill_world',
    'world_id': instance.id,
  });
  action_submitted.value[instance.id] = false;
};
const onSliderChange = async (newValue: boolean) => {
  await store.dispatch(
    'builder/world_patch',
    {
      maintenance_mode: newValue,
      maintenance_msg: maintenance_msg.value,
    });
};

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