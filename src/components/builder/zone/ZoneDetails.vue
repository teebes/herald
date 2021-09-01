<template>
  <div id="zone-details" v-if="zone">
    <h2 class="zone-name entity-title">{{ zone.name }}</h2>
    <template v-if="isReady">
      <div class="zone-map-and-data" v-if="isReady">
        <div class="map-and-edit">
          <Map
            :center_key="$store.state.builder.room.key"
            :radius="5"
            :unit="8"
            :map="$store.state.builder.map"
            :rooms_filter="zone_rooms"
            @clickRoom="onClickRoom"
          />
          <div>
            <button class="btn-thin edit-mob" @click="editInfo">EDIT</button>
          </div>
        </div>

        <div class="zone-loads">
          <div v-if="zone_mobs.length">
            <h3>MOB LOADS</h3>
            <div v-for="mob in zone_mobs" :key="mob.id">
              <router-link
                :to="{name: BUILDER_MOB_TEMPLATE_DETAILS, params: {world_id: $route.params.world_id, mob_template_id: mob.id}}"
              >{{ mob.level }} - {{ mob.name }}</router-link>
              <span class='color-text-50' v-if="mob.is_elite">[elite]</span>
            </div>
            <div v-if="!zone_mobs">None.</div>
          </div>

          <div v-if="zone_items.length">
            <h3>ITEM LOADS</h3>
            <div v-for="item in zone_items" :key="item.id">
              <router-link
                :to="{name: BUILDER_ITEM_TEMPLATE_DETAILS, params: {world_id: $route.params.world_id, item_template_id: item.id}}"
              >{{ item.name }}</router-link>
            </div>
            <div v-if="!zone_items">None.</div>
          </div>
        </div>
      </div>

      <div v-else-if="!$store.state.builder.zone_rooms.length">Zone has no rooms.</div>
      <div v-else class="emptymap">Loading...</div>

      <div class="zone-data" v-if="zone.zone_data && Object.keys(zone.zone_data).length">
        <h3>ZONE DATA</h3>
        <div v-for="attr of Object.keys(zone.zone_data).sort()" :key="attr">
          <dl>
            <dt>{{attr}}</dt>
            <dd>
              <span v-if="zone.zone_data[attr]">{{ zone.zone_data[attr] }}</span>
              <span v-else>null</span>
            </dd>
          </dl>
        </div>
      </div>
    </template>
    <div v-else-if="loaded && !zone_rooms.length">
      <div
        class="color-text-70"
      >Zone has no rooms. Go to an existing room and assign it to this zone to see a map.</div>
      <div>
        <button class="btn-thin edit-mob" @click="editInfo">EDIT</button>
        <button class="btn-thin color-text-red" @click="deleteZone">DELETE</button>
      </div>
    </div>

    <div class="hlist respawn-frequency mt-8">
      <div class="hlist-header">
        <h3>RESPAWN FREQUENCY</h3>
      </div>
      <div class="hlist-item">
        <label>
          <input type="checkbox" :checked="respawns" @input="onChangeRespawns" />
          Respawns
        </label>
      
        <div class="respawn-wait mt-2" v-if="respawns">
          <div>
            <span
              v-if="zone.respawn_wait"
            >Wait {{ zone.respawn_wait }} seconds before respawning.</span>
            <span v-else>Respawns immediately.</span>
          </div>
          <button class="btn-thin" @click="editRespawns">EDIT</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MUTATIONS,
  UI_MODALS,
} from "@/constants";
import { Room } from "@/core/interfaces";
import Map from "@/components/Map.vue";
import axios from "axios";
import ZoneView from "@/components/builder/zone/ZoneView";
import {
  BUILDER_ZONE_INDEX,
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_ITEM_TEMPLATE_DETAILS,
} from "@/router";
import { BUILDER_FORMS, FormElement } from "@/core/forms.ts";

@Component({
  components: {
    Map,
  },
})
export default class ZoneDetails extends Mixins(ZoneView) {
  zone_rooms: Array<Room> = [];
  zone_mobs: {}[] = [];
  zone_items: {}[] = [];
  loaded: boolean = false;

  BUILDER_MOB_TEMPLATE_DETAILS = BUILDER_MOB_TEMPLATE_DETAILS;
  BUILDER_ITEM_TEMPLATE_DETAILS = BUILDER_ITEM_TEMPLATE_DETAILS;

  get respawns() {
    return this.$store.state.builder.zone.respawn_wait >= 0;
  }

  get zone() {
    return this.$store.state.builder.zone;
  }

  get isReady() {
    return Boolean(
      this.$store.state.builder.map &&
        this.zone &&
        this.$store.state.builder.room &&
        this.zone_rooms.length
    );
  }

  async mounted() {
    const world_id = this.$route.params.world_id;
    const zone_id = this.$route.params.zone_id;

    // build promise to fetch zone's loads
    const zone_loads_promise = axios.get(
      `builder/worlds/${world_id}/zones/${zone_id}/loads/`
    );

    // build promise to fetch zone's rooms

    const zone_rooms_promise = this.$store.dispatch(
      BUILDER_ACTIONS.ZONE_ROOMS_FETCH,
      {
        world_id: world_id,
        zone_id: zone_id,
      }
    );

    // builder promise to fetch zone's details
    const zone_details_promise = this.$store.dispatch(
      BUILDER_ACTIONS.ZONE_FETCH,
      {
        world_id: this.$route.params.world_id,
        zone_id: zone_id,
      }
    );

    const [
      zone_loads_resp,
      zone_rooms_resp,
      //zone_details_resp
    ] = await Promise.all([
      zone_loads_promise,
      zone_rooms_promise,
      //zone_details_promise
    ]);

    this.zone_mobs = zone_loads_resp.data.mobs;
    this.zone_items = zone_loads_resp.data.items;
    this.zone_rooms = zone_rooms_resp;
    this.loaded = true;
  }

  async editInfo() {
    const entity = this.$store.state.builder.zone;

    console.log(this.$store.state);

    const schema: FormElement[] = [
      {
        attr: "name",
        label: "Name",
      },
    ];

    if (this.$store.state.builder.world.is_multiplayer) {
      schema.push({
        attr: "pvp_zone",
        label: "Allows PvP",
        default: false,
        widget: "checkbox",
      });
    }

    const modal = {
      title: `Zone ${entity.id}`,
      data: entity,
      schema: schema,
      action: BUILDER_ACTIONS.ZONE_SAVE,
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteZone() {
    const zone = this.$store.state.builder.zone;

    // Crude confirm dialog
    const c = confirm(`Are you sure you want to delete Zone ${zone.id}: ${zone.name}?`);
    if (!c) return;

    await this.$store.dispatch(BUILDER_ACTIONS.ZONE_DELETE);
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Zone ${zone.id}`
    );
  }

  onChangeRespawns(event) {
    const checked = event.target.checked;
    let respawn_wait = -1;
    if (checked) respawn_wait = 300;
    this.$store.dispatch("builder/zone_save", {
      respawn_wait: respawn_wait,
    });
  }

  editRespawns() {
    const entity = this.zone;
    const modal = {
      data: entity,
      schema: [
        {
          attr: "respawn_wait",
          label: "Respawn Wait",
          help: "How long to wait before re-running this loader, in seconds.",
        },
      ],
      action: "builder/zone_save",
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";

#zone-details {
  width: 100%;

  .zone-map-and-data {
    display: flex;
    @media ($mobile-site) {
      flex-direction: column;
      .zone-loads {
        margin-top: 15px;
      }
    }
    @media ($desktop-site) {
      .zone-loads {
        margin-left: 25px;
      }
    }

    .zone-loads {
      display: flex;
      > div {
        &:not(:last-child) {
          margin-right: 15px;
        }
        h3 {
          margin-bottom: 10px;
        }

        a {
          color: $color-text;
        }
      }
    }
  }

  .emptymap {
    border: 1px solid #444;
    width: 272px;
    height: 272px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .zone-data {
    width: 320px;

    margin-top: 30px;
    h3 {
      margin-bottom: 15px;
    }

    dl {
      display: flex;
      flex-wrap: wrap;
      dt {
        color: $color-text-hex-70;
        width: 45%;
        text-align: right;
        margin-right: 5%;
      }
      dd {
        margin-left: 5%;
        width: 45%;
      }
    }
  }

  .respawn-frequency {
    width: 300px;
  }
}
</style>