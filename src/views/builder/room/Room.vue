<template>
  <div id="room-details" v-if="room">
    <h2 class="entity-title">{{ room.name }}</h2>

    <div v-if="store.state.builder.world.builder_info.builder_rank < 3 && room.has_assignment != undefined" class="color-text-50 mb-4">
      <span v-if="room.has_assignment">This room is assigned to you, you can edit it.</span>
      <span v-else>This room is not assigned to you, you can view it but not edit it.</span>
    </div>

    <div v-if="isMapReady" class="info-and-map">
      <div class="id-map-coords">
        <div class="id-and-coords">
          <div class="room-id" :title="room.key">{{ room.id }}</div>
          <div class="room-coordinates">({{ room.x }}, {{ room.y }}, {{ room.z}})</div>
        </div>
        <Map
          v-if="isMapReady"
          :map="map"
          :center_key="center_key"
          :unit="8"
          :radius="3"
          :display_planes="true"
          @clickRoom="onMapClickRoom"
        />
        <div class="basic-actions mt-1">
          <button class="btn-small mr-4" @click="editInfo">EDIT</button>
          <button class="btn-small" @click="deleteRoom">DELETE</button>
        </div>
      </div>

      <div class="room-description">
        <div class="description-title">Description</div>
        <RoomDescription v-if="room.description" :room="room" />
        <div class="description-content no-description" v-else>Room has no description.</div>
        <button class="btn-thin" @click="onEditDescription">EDIT DESCRIPTION</button>
      </div>
    </div>

    <div class='flex actions-and-doors'>
      <RoomDirActions />

      <div class='doors' v-if="roomDoors.length">
        <h3>DOORS</h3>
        <div v-for="door in roomDoors" :key="door.direction">
          {{ door.direction }}: {{ door.name || "unnamed" }}
          [{{ door.default_state }}]
          <template v-if="door.key">
            - opened by <router-link :to="key_link(door.key)">{{ door.key.name }}</router-link>
          </template>
        </div>
      </div>
    </div>

    <div class="mt-8" v-if="room.note">
      <h3>ROOM NOTE</h3>
      <div>{{ room.note }}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import Map from "@/components/ui/Map.vue";
import { DIRECTIONS } from "@/constants";
import RoomDirActions from "@/components/builder/room/RoomDirActions.vue";
import { BUILDER_FORMS } from "@/core/forms";
import RoomDescription from "@/components/builder/room/RoomDescription.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const map = computed(() => store.state.builder.map);
const center_key = computed(() => store.state.builder.room.key);
const room = computed(() => store.state.builder.room);
const roomDoors = computed<any[]>(() => {
  if (!room.value.doors) return [];
  const doors: {}[] = [];
  for (const direction in DIRECTIONS) {
    if (room.value.doors[direction]) {
      doors.push(room.value.doors[direction]);
    }
  }
  return doors;
});

const isMapReady = computed(() => Boolean(store.state.builder.room && store.state.builder.map));

const key_link = (key: any) => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: route.params.world_id,
      item_template_id: key.id
    }
  };
};

const onTypeE = (e: KeyboardEvent) => {
  if (store.state.ui.modal.isOpen) return;
  const key = String.fromCharCode(e.keyCode).toLowerCase();
  if (key === "e") editInfo();
};

onMounted(async () => {
  window.addEventListener("keypress", onTypeE);
  if (!store.state.builder.room || store.state.builder.room != route.params.room_id) {
    const room = await store.dispatch("builder/room_fetch", {
      world_id: route.params.world_id,
      room_id: route.params.room_id
    });

    if (!store.state.builder.zone || store.state.builder.zone != room.zone.id) {
      await store.dispatch("builder/zone_fetch", {
        world_id: route.params.world_id,
        zone_id: room.zone.id
      });
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("keypress", onTypeE);
});

const editInfo = () => {
  const modal = {
    data: room.value,
    schema: BUILDER_FORMS.ROOM_INFO,
    action: "builder/room_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const deleteRoom = async () => {
  const room_id = store.state.builder.room.id;
  const c = confirm(`Are you sure you want to delete Room ${room_id}?`);
  if (!c) return;
  await store.dispatch("builder/room_delete");
  store.commit("ui/notification_set", `Deleted Room ${room_id}`);
};

const onEditDescription = () => {
  const modal = {
    class: "description-modal",
    data: store.state.builder.room,
    schema: [BUILDER_FORMS.DESCRIPTION],
    action: "builder/room_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const onMapClickRoom = (room) => {
  store.dispatch("builder/room_select", room);
  router.push({
    name: 'builder_room_index',
    params: {
      world_id: route.params.world_id,
      zone_id: route.params.zone_id,
      room_id: room.id
    }
  });
};
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

#room-details {
  width: 100%;
  max-width: 800px;

  .info-and-map {
    display: flex;
    width: 100%;

    .id-map-coords {
      margin-right: 20px;

      .id-and-coords {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5em;

        .room-id {
          color: $color-text-70;
        }
      }
    }

    .room-description {
      flex-grow: 1;
      .description-title {
        color: $color-text-70;
        margin-bottom: 0.5em;
      }
      .description-content {
        border: 1px dotted $color-form-border;
        padding: 5px 10px;
        height: 178px;
        overflow-y: auto;
      }
      button {
        margin-top: 8px;
      }
    }
  }

  .actions-and-doors {
    @media ($mobile-site) {
      flex-direction: column;
    }
    @media ($desktop-site) {
      .doors {
        margin-left: 60px;
        margin-top: 40px;
      }
    }
  }
}
</style>