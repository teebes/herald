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
          <!-- :
            <span v-if="panel.maintenance_mode">ON</span>
            <span v-else>OFF</span> -->
        </div>

        <div class="slider-container">
          <!-- <Slider
              :value="panel.maintenance_mode"
              @change="onSliderChange"/>
          </div> -->
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

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import Slider from "@/components/forms/Slider.vue";
import axios from "axios";
import { BUILDER_WORLD_PLAYER_DETAIL, STAFF_USER_INFO, BUILDER_WORLD_INDEX } from "@/router";
import { UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList,
    Slider,
  }
})
export default class StaffPage extends Vue {
  search_query: string = "";
  user_results: any[] = [];
  player_results: any[] = [];

  timeout: number | null = null;

  broadcast_message: string = "";

  // @Watch('$store.state.forge.ws')
  // async onForgsWsChanged(newValue, oldValue) {
  //   if (newValue) {
  //     await this.$store.dispatch('forge/send', {
  //       'type': 'sub',
  //       'sub': 'staff.panel',
  //     })
  //   }
  // }

  async created() {
    await this.$store.dispatch('forge/send', {
      'type': 'sub',
      'sub': 'staff.panel',
    });
    await this.$store.dispatch('staff/staff_panel_fetch');
  }

  async destroyed() {
    if (this.$store.state.forge.ws) {
      await this.$store.dispatch('forge/send', {
        'type': 'unsub',
        'sub': 'staff.panel',
      })
    }
  }

  get panel() {
    return this.$store.state.staff.panel;
  }

  user_details(user) {
    return {
      name: STAFF_USER_INFO,
      params: { user_id: user.id },
    };
  }

  player_details(player) {
    return {
      name: BUILDER_WORLD_PLAYER_DETAIL,
      params: { player_id: player.id, world_id: player.root_world_id },
    };
  }

  world_details(player) {
    return {
      name: BUILDER_WORLD_INDEX,
      params: { world_id: player.root_world_id },
    };
  }

  @Watch("search_query")
  onSearchQueryChange() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.onSearch();
    }, 500);
  }

  async onSearch() {
    const query = this.search_query.trim();
    const params = { q: query }

    const resp = await axios.get("staff/search", {
      params: params
    });

    this.user_results = resp.data.users;
    this.player_results = resp.data.players;
  }

  async initialize() {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Initializing...",
      expires: false
    });
    // await this.$store.dispatch('staff/staff_panel_initialize');
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'initialize'
    })
  }

  async teardown() {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Tearing down...",
      expires: false
    });
    // await this.$store.dispatch('staff/staff_panel_teardown');
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'teardown'
    })
  }

  async build_nexus(nexus) {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Starting Nexus...",
      expires: false
    });
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'build_nexus',
      nexus_id: nexus.id,
    });
  }

  async delete_nexus(nexus) {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Deleting Nexus...",
      expires: false
    });
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'delete_nexus',
      nexus_id: nexus.id,
    });
  }

  async rebuild_nexus(nexus) {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Rebuilding Nexus...",
      expires: false
    });
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'rebuild_nexus',
      nexus_id: nexus.id,
    });
  }

  async broadcast() {
    console.log('broadcast attempt')
    if (!this.broadcast_message) return;

    console.log('broadcasting')

    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Broadcasting...",
      expires: false
    });
    await this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'broadcast',
      message: this.broadcast_message,
    });
  }

  world_admin_link(context_id) {
    return {
      name: 'builder_world_admin',
      params: { world_id: context_id  }
    }
  }

  world_admin_instance_link(context_id, instance_id) {
    return {
      name: 'builder_world_admin_instance',
      params: {
        world_id: context_id,
        instance_id: instance_id,
      }
    }
  }

  onSliderChange(newValue: boolean) {
    this.$store.dispatch('forge/send', {
      type: 'job',
      job: 'toggle_maintenance_mode',
    });
  }

}
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