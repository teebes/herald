<template>
  <div id="zone-details" v-if="zone">
    <h2 class="zone-name entity-title">{{ zone.name }}</h2>

    <div v-if="store.state.builder.world.builder_info.builder_rank < 3 && zone.has_assignment != undefined" class="color-text-50 mb-4">
      <span v-if="zone.has_assignment">This zone is assigned to you, you can edit it.</span>
      <span v-else>This zone is not assigned to you, you can view it but not edit it.</span>
    </div>

    <template v-if="isReady">
      <div class="zone-map-and-data" v-if="isReady">
        <div class="map-and-edit">
          <Map
            :center_key="center_key"
            :radius="5"
            :unit="8"
            :map="map"
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
                :to="mob_link(mob.id)"
              >{{ mob.level }} - {{ mob.name }}</router-link>
              <span class='color-text-50 ml-2' v-if="mob.is_elite">[elite]</span>
            </div>
            <div v-if="!zone_mobs">None.</div>
          </div>

          <div v-if="zone_items.length">
            <h3>ITEM LOADS</h3>
            <div v-for="item in zone_items" :key="item.id">
              <router-link
                :to="item_link(item.id)"
              >{{ item.name }}</router-link>
            </div>
            <div v-if="!zone_items">None.</div>
          </div>
        </div>
      </div>

      <div v-else-if="!zone_rooms.length">Zone has no rooms.</div>
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
        <button class="btn-thin" @click="deleteZone">DELETE</button>
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

<script lang='ts' setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { selectZone } from "@/composables/selectZone";

const store = useStore();
const route = useRoute();
const router = useRouter();

import { Room } from "@/core/interfaces";
import Map from "@/components/ui/Map.vue";
import axios from "axios";
import { FormElement } from "@/core/forms.ts";

const zone_rooms = ref<Room[]>([]);
const zone_mobs = ref<any[]>([]);
const zone_items = ref<any[]>([]);
const loaded = ref(false);
const respawns = computed(() => store.state.builder.zone.respawn_wait >= 0);
const zone = computed(() => store.state.builder.zone);
const isReady = computed(() => {
  return Boolean(
    store.state.builder.map &&
      zone.value &&
      store.state.builder.room &&
      zone_rooms.value.length
  );
});
const center_key = computed(() => store.state.builder.room.key);
const map = computed(() => store.state.builder.map);


const onClickRoom = async (room) => {
  store.commit('builder/room_set', room);

  if (room.zone.id != route.params.zone_id) {
    await store.dispatch('builder/zone_fetch', {
      world_id: route.params.world_id,
      zone_id: room.zone.id,
    });

    // Update route
    router.push({
      name: 'builder_zone_index',
      params: {
        zone_id: room.zone.id,
        world_id: route.params.world_id
      }
    });
  }
};


onMounted(async () => {
  const world_id = route.params.world_id;
  const zone_id = route.params.zone_id;

  // build promise to fetch zone's loads
  const zone_loads_promise = axios.get(`builder/worlds/${world_id}/zones/${zone_id}/loads/`);

  // build promise to fetch zone's rooms

  const zone_rooms_promise = store.dispatch('builder/zone_rooms_fetch', {
    world_id: world_id,
    zone_id: zone_id,
  });

  const zone_details_promise = store.dispatch('builder/zone_fetch', {
        world_id: route.params.world_id,
        zone_id: route.params.zone_id
      });

  const [
    zone_loads_resp,
    zone_rooms_resp,
    _,
  ] = await Promise.all([
    zone_loads_promise,
    zone_rooms_promise,
    zone_details_promise,
  ]);

  zone_mobs.value = zone_loads_resp.data.mobs;
  zone_items.value = zone_loads_resp.data.items;
  zone_rooms.value = zone_rooms_resp;
  loaded.value = true;
});

selectZone();

const editInfo = () => {
  const entity = store.state.builder.zone;

  const schema: FormElement[] = [
    {
      attr: "name",
      label: "Name",
    },
  ];

  if (store.state.builder.world.is_multiplayer) {
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
    action: 'builder/zone_save',
  };
  store.commit('ui/modal/open_form', modal);
};

const deleteZone = async () => {
  const zone = store.state.builder.zone;

  // Crude confirm dialog
  const c = confirm(`Are you sure you want to delete Zone ${zone.id}: ${zone.name}?`);
  if (!c) return;

  await store.dispatch('builder/zone_delete');
  store.commit(
    'ui/notification_set',
    `Deleted Zone ${zone.id}`
  );
};

const onChangeRespawns = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  let respawn_wait = -1;
  if (checked) respawn_wait = 300;
  store.dispatch("builder/zone_save", {
    respawn_wait: respawn_wait,
  });
};

const editRespawns = () => {
  const entity = store.state.builder.zone;
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
  store.commit('ui/modal/open_form', modal);
};

const mob_link = (mob_id) => {
  let world_id = store.state.builder.world.id;
  if (store.state.builder.world.instance_of.id) {
    world_id = store.state.builder.world.instance_of.id;
  }

  return {
    name: 'builder_mob_template_details',
    params: { world_id: world_id, mob_template_id: mob_id }
  }
};

const item_link = (item_id) => {
  let world_id = store.state.builder.world.id;
  if (store.state.builder.world.instance_of.id) {
    world_id = store.state.builder.world.instance_of.id;
  }

  return {
    name: 'builder_item_template_details',
    params: { world_id: world_id, item_template_id: item_id }
  }
};

// const mob_link = computed((mob_id) => {
//   let world_id = store.state.builder.world.id;
//   if (store.state.builder.world.instance_of.id) {
//     world_id = store.state.builder.world.instance_of.id;
//   }

//   return {
//     name: 'builder_mob_template_details',
//     params: { world_id: world_id, mob_template_id: mob_id }
//   }
// });
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