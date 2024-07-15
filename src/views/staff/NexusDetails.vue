<template>
  <div v-if="nexus">
    <h2 class="mb-8">{{ nexus.name.toUpperCase() }} DETAILS</h2>

    <p>State: {{ nexus.state }}</p>

    <div class="maintenance panel">
      <div class="maintenance-status mb-2 flex">
        <div class="mt-1">Maintenance mode:</div>
        <div class='slider-container'>
          <Slider :value="nexus.maintenance_mode" @change="onSliderChange" />
        </div>
      </div>
    </div>

    <div class="nexus-actions mt-4">
      <button class="btn-small mr-2" @click="build_nexus(nexus)" v-if="nexus.state == 'absent'">BUILD</button>
      <button class="btn-small mr-2" @click="delete_nexus(nexus)" v-if="nexus.state == 'ready'">DELETE</button>
      <button class="btn-small mr-2" @click="rebuild_nexus(nexus)" v-if="nexus.state == 'ready'">REBUILD</button>
    </div>

    <div class="nexus-worlds mt-8" v-if="nexus_data && nexus_data.worlds.length">
      <h3 class="mb-4">WORLDS</h3>
      <div class="worlds mt-2">
        <div v-for="world in nexus_data.worlds" :key="world.key">
          *
          [ <router-link :to="world_admin_instance_link(world.context_id, world.id)">{{ world.id }}</router-link> ]
          -
          <router-link :to="world_admin_link(world.context_id)">{{ world.name }}</router-link>
          -
          {{ world.state }}
        </div>
      </div>

    </div>

    <div class="nexus-data mt-8" v-if="nexus.state == 'ready' && nexus_data">
      <h3 class="mb-4">NEXUS DATA</h3>
      <p>DB Size: {{ nexus_data.dbsize }}</p>
      <p>Max lag: {{ max_lag }}</p>
      <p>Timings depth: {{ nexus_data.timings.length }}</p>

      <h3 class="mt-8 mb-4">TIMINGS</h3>
      <template v-for="timing in timings" v-if="timings.length">
        <div class="flex">
          <div class="toggle" @click="toggleDetails(timing.expires)">
            <span v-if="expanded[timing.expires]">&mdash;</span>
            <span v-else>+</span>
          </div>
          <div class="world ml-4">{{ timing.world }}</div>
          <div class="age ml-4">{{ timing.age }}</div>
          <div class="type ml-4 flex-grow">{{ timing.type }}</div>
        </div>
          <pre v-if="expanded[timing.expires]" class="mt-2 mb-4">{{ timing }}</pre>
      </template>
      <div v-else>None.</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Slider from "@/components/forms/Slider.vue";

const store = useStore();
const route = useRoute();

const expanded = ref({});

const nexus = computed(() => store.state.staff.nexus);

const nexus_data = computed(() => store.state.staff.nexus_data);
const max_lag = computed(() => {
  const timings = store.state.staff.nexus_data.timings;

  if (!timings.length) { return 0; }

  const timing_json = JSON.parse(timings[0][0])
  const expires = timing_json.expires;
  return (-1) * (expires - store.state.staff.nexus_data.now);
})
const timings = computed(() => {
  return store.state.staff.nexus_data.timings.map((timing) => {
    const timing_json = JSON.parse(timing[0]);
    timing_json.age = (timing_json.expires - store.state.staff.nexus_data.now).toFixed(3);
    return timing_json;
  });
});

onMounted(async () => {
  // await store.dispatch('staff/nexus_fetch',route.params.nexus_id);
  // Fetch both the nexus and its data
  const nexus_promise = store.dispatch('staff/nexus_fetch', route.params.nexus_id);
  const nexus_data_promise = store.dispatch('staff/nexus_data_fetch', route.params.nexus_id);
  await Promise.all([nexus_promise, nexus_data_promise]);

  console.log('promises fulfilled');
  console.log(nexus_data.value);
})

const toggleDetails = (expires) => {
  expanded.value[expires] = !expanded.value[expires];
}

const onSliderChange = async (newValue: boolean) => {
  await store.dispatch('staff/nexus_patch', {
    maintenance_mode: newValue,
  });
}

const build_nexus = async (nexus) => {
  store.commit('ui/notification_set', {
    text: "Starting Nexus...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'build_nexus',
    nexus_id: nexus.id,
  });
};

const delete_nexus = async (nexus) => {
  store.commit('ui/notification_set', {
    text: "Deleting Nexus...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'delete_nexus',
    nexus_id: nexus.id,
  });
};

const rebuild_nexus = async (nexus) => {
  store.commit('ui/notification_set', {
    text: "Rebuilding Nexus...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'rebuild_nexus',
    nexus_id: nexus.id,
  });
};

const world_admin_link = (context_id) => {
  return {
    name: 'builder_world_admin',
    params: { world_id: context_id  }
  }
};

const world_admin_instance_link = (context_id, instance_id) => {
  return {
    name: 'builder_world_admin_instance',
    params: {
      world_id: context_id,
      instance_id: instance_id,
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

div.toggle {
  cursor: pointer;
  width: 10px;
}
pre {
  border: 1px solid $color-background-light-border-selected;
  padding: 20px;
}

.slider-container {
  transform: scale(0.6);
}
</style>