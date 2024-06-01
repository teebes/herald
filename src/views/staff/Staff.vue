<template>
  <div id="page">
    <div class="staff-panel" v-if="panel">
      <h2>Staff Control Panel</h2>

      <div class="mt-2">24-hour New User Signups: {{ panel.user_signups.total }} ({{ panel.user_signups.confirmed }}
        confirmed).</div>
      <div class="mt-2">24-hour Unique Players: {{ panel.user_connections }}</div>

      <div class="controls mt-4">

        <h3 class="my-2">CONTROLS</h3>

        <div class="maintenance panel">
          <div class="maintenance-status mb-2 flex">
            <div class="mt-1">Maintenance mode:</div>
            <div class='slider-container'>
              <Slider :value="panel.maintenance_mode" @change="onSliderChange" />
            </div>
          </div>
        </div>

        <div class="mt-2">
          <button class="btn-small" @click="initialize">INITIALIZE</button>
          <button class="btn-small ml-1" @click="teardown">TEARDOWN</button>
        </div>


        <!-- Broadcast -->
        <div class="broadcast my-8">
          <h3 class="my-2">BROADCAST</h3>
          <div class="form-group">
            <textarea v-model="broadcast_message" rows="3"></textarea>
          </div>
          <div class="mt-2">
            <button class="btn-small" @click="broadcast">BROADCAST</button>
          </div>
        </div>

        <!-- Nexuses -->
        <div class="nexuses mt-4">

          <h3 class="my-2">NEXUSES</h3>

          <div v-for="nexus in panel.nexuses" :key="nexus.id">
            <div class="mb-1">
              [ {{ nexus.id }} ] {{ nexus.name }} - {{ nexus.state }}
              <button class="btn-small ml-2" @click="build_nexus(nexus)" v-if="nexus.state == 'absent'">BUILD</button>
              <button class="btn-small ml-2" @click="delete_nexus(nexus)" v-if="nexus.state == 'ready'">DELETE</button>
              <button class="btn-small ml-1" @click="rebuild_nexus(nexus)"
                v-if="nexus.state == 'ready'">REBUILD</button>
            </div>
          </div>
          <div v-if="panel.nexuses && panel.nexuses.length == 0">No online Nexus.</div>
        </div>

        <!-- Running Worlds -->
        <div class="running-worlds mt-4">
          <h3 class="my-2">RUNNING WORLDS</h3>

          <div class="worlds mt-2">
            <div v-for="world in panel.running_worlds" :key="world.key">
              *
              [ <router-link :to="world_admin_instance_link(world.context_id, world.id)">{{ world.id }}</router-link> ]
              -
              <router-link :to="world_admin_link(world.context_id)">{{ world.name }}</router-link>
              -
              <span v-if="world.nexus_data">{{ world.nexus_data.name }} ({{ world.nexus_data.state }})</span>
              <span v-else>No Nexus</span>
            </div>
            <div class="mt-2">{{ panel.running_worlds_count }} Total</div>
          </div>
        </div>

        <!-- WIP Worlds -->
        <div class="wip-worlds mt-4">
          <h3 class="my-2">WIP WORLDS</h3>

          <div class="worlds mt-2">
            <div v-for="world in panel.wip_worlds" :key="world.key">
              *
              [ <router-link :to="world_admin_instance_link(world.context_id, world.id)">{{ world.id }}</router-link> ]
              -
              <router-link :to="world_admin_link(world.context_id)">{{ world.name }}</router-link>
              -
              {{ world.state }}
              -
              <span v-if="world.nexus_data">{{ world.nexus_data.name }} ({{ world.nexus_data.state }})</span>
              <span v-else>No Nexus</span>
              - {{ world.time_since_last_change }}
            </div>
            <div class="mt-2">{{ panel.wip_worlds_count }} Total</div>
          </div>
        </div>
      </div>


      <div class="search-panel mt-4">
        <div>
          <h3 class='my-2'>SEARCH</h3>
          <div class='form-group search mt-4'>
            <input type='text' v-model="search_query" @keyup.enter="onSearch" />
          </div>
        </div>

        <div class="mt-4" v-if="user_results.length">
          <h3>USERS</h3>
          <div v-for="user in user_results" :key="user.id">
            [ {{ user.id }} ]
            <router-link :to="user_details(user)">{{ user.email }}</router-link>
            <span v-if="user.name">- {{ user.name }}</span>
          </div>
        </div>

        <div class="mt-4" v-if="player_results.length">
          <h3>PLAYERS</h3>
          <div v-for="player in player_results" :key="player.id">
            [ {{ player.id }} ]
            <router-link :to="player_details(player)">{{ player.name }}</router-link>
            ({{ player.user_id }})
            -
            <router-link :to="world_details(player)">{{ player.world_name }}</router-link>
          </div>
        </div>
      </div>

    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import Slider from "@/components/forms/Slider.vue";
import axios from "axios";

const store = useStore();

const search_query = ref("");
const user_results = ref<any[]>([]);
const player_results = ref<any[]>([]);
const broadcast_message = ref("");
let timeout: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  await store.dispatch('forge/send', {
    'type': 'sub',
    'sub': 'staff.panel',
  });
  await store.dispatch('staff/staff_panel_fetch');
});

onUnmounted(async () => {
  if (store.state.forge.ws) {
    await store.dispatch('forge/send', {
      'type': 'unsub',
      'sub': 'staff.panel',
    })
  }
});

const panel = computed(() => store.state.staff.panel);

const user_details = (user) => {
  return {
    name: 'staff_user_info',
    params: { user_id: user.id },
  };
}

const player_details = (player) => {
  return {
    name: 'builder_world_player_details',
    params: { player_id: player.id, world_id: player.root_world_id },
  };
};

const world_details = (player) => {
  return {
    name: 'builder_world_index',
    params: { world_id: player.root_world_id },
  };
};

watch(search_query, () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    onSearch();
  }, 500);
});


const onSearch = async () => {
  const query = search_query.value.trim();
  const params = { q: query }

  const resp = await axios.get("staff/search", {
    params: params
  });

  user_results.value = resp.data.users;
  player_results.value = resp.data.players;

};

const initialize = async () => {
  store.commit('ui/notification_set', {
    text: "Initializing...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'initialize'
  })
};

const teardown = async () => {
  store.commit('ui/notification_set', {
    text: "Tearing down...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'teardown'
  })
};

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

const broadcast = async () => {
  if (!broadcast_message.value) return;

  store.commit('ui/notification_set', {
    text: "Broadcasting...",
    expires: false
  });
  await store.dispatch('forge/send', {
    type: 'job',
    job: 'broadcast',
    message: broadcast_message.value,
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
const onSliderChange = () => {
  store.dispatch('forge/send', {
    type: 'job',
    job: 'toggle_maintenance_mode',
  });
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.search { max-width: 320px }
.slider-container {
  transform: scale(0.6);
}
</style>