<template>
  <div id="page">
    <h2>Staff Control Panel</h2>

    <div class="staff-panel" v-if="panel">

      <!-- Nexuses -->
      <div class="nexuses mt-4">
        <h3>NEXUSES STATUS</h3>

        <div class="sandbox mt-2" v-if="panel.sandbox_nexus">
          Tier 1 Sandbox:
          <span v-if="panel.sandbox_nexus.is_ready">Up</span>
          <span v-else>Down</span>
        </div>

        <div class="tier2 mt-2">
          Tier 2 Worlds:
          <div v-if="panel.tier_2 && panel.tier_2.length">
            <div v-for="world in panel.tier_2" :key="world.id">
              * {{ world.name }} -
              <span v-if="world.nexus_data.is_ready">Up</span>
              <span v-else>Down</span>
            </div>
          </div>
          <div v-else>None</div>
        </div>

        <div class="tier3 mt-2">
          Tier 3 Worlds:<br/>
          <div v-for="world in panel.tier_3" :key="world.key">
            * {{ world.name }} -
            <span v-if="world.nexus_data.is_ready">Up</span>
            <span v-else>Down</span>
          </div>
        </div>

        <div class="mt-2">
          <button class="btn-small" @click="initialize">INITIALIZE</button>
          <button class="btn-small ml-2" @click="teardown">TEARDOWN</button>
        </div>
      </div>

      <!-- Running Worlds -->
      <div class="running-worlds mt-8">
        <h3>RUNNING WORLDS</h3>

        <div class="worlds mt-2">
          <div v-for="world in panel.running_worlds" :key="world.key">
            *
            [ <router-link :to="world_admin_instance_link(world.context_id, world.id)">{{  world.id  }}</router-link> ]
            -
            <router-link :to="world_admin_link(world.context_id)">{{ world.name }}</router-link>
            - Nexus
            <span v-if="world.nexus_data.is_ready">Up</span>
            <span v-else>Down</span>
          </div>
          <div class="mt-2">{{ panel.running_worlds_count }} Total</div>
        </div>
      </div>

    </div>


    <div class="search-panel mt-8">
      <div>
        <h3>SEARCH</h3>
        <div class='form-group search mt-4'>
          <input type='text' v-model="search_query" @keyup.enter="onSearch"/>
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
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import axios from "axios";
import { BUILDER_WORLD_PLAYER_DETAIL, STAFF_USER_INFO, BUILDER_WORLD_INDEX } from "@/router";
import { UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class StaffPage extends Vue {
  search_query: string = "";
  user_results: any[] = [];
  player_results: any[] = [];

  timeout: number | null = null;

  @Watch('$store.state.ui.forge_ws')
  async onForgsWsChanged(newValue, oldValue) {
    if (newValue) {
      await this.$store.dispatch('forge/send', {
        'type': 'sub',
        'sub': 'staff.panel',
      })
    }
  }

  async created() {
    await this.$store.dispatch('staff/staff_panel_fetch');
  }

  async destroyed() {
    if (this.$store.state.ui.forge_ws) {
      await this.$store.dispatch('ui/send', {
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
      params: { player_id: player.id, world_id: player.world_id },
    };
  }

  world_details(player) {
    return {
      name: BUILDER_WORLD_INDEX,
      params: { world_id: player.world_id },
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
    await this.$store.dispatch('staff/staff_panel_initialize');
  }

  async teardown() {
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, {
      text: "Tearing down...",
      expires: false
    });
    await this.$store.dispatch('staff/staff_panel_teardown');
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

}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.search { max-width: 320px }
</style>