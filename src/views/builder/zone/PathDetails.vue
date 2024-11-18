<template>
  <div v-if="path">
    <h2>
      {{ store.state.builder.path.name }}
      <div>
        <button class="btn-small" @click="editInfo">EDIT</button>
        <button class="btn-small ml-2" @click="deletePath">DELETE</button>
      </div>
    </h2>
    <div class="map-and-rooms">
      <Map
        class="path-rooms-map"
        v-if="mapReady"
        :radius="5"
        :unit="8"
        :map="map"
        :rooms_filter="zone_rooms"
        :center_key="room.key"
        :modified_rooms="room_modifiers"
        @clickRoom="onClickRoom"
      />
      <InColumnList
        v-if="path.rooms"
        class="path-rooms"
        :endpoint="path_rooms_endpoint"
        :endpoint_filters="endpoint_filters"
        :schema="path_room_schema"
        :initial_new_data="initial_data"
        :editable="false"
        title="Path Rooms"
        :selected="(element) => element.room.id == room.id"
        @add="onAddRoom"
        @remove="onRemoveRoom"
        @clickElement="onClickPathRoom"
      />
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang='ts' setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Map from "@/components/ui/Map.vue";
import { Room } from "@/core/interfaces";
import InColumnList from "@/components/incolumnlist/List.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";
/*
  This view is tricky because the ElementList handles the PathRoom
  intermediary objects as the element, whereas in this view the path_rooms
  are a list of Room objects.
*/

const store = useStore();
const router = useRouter();
const route = useRoute();

const path = ref<any>(null);
const path_rooms = ref<Room[]>([]);
const room_modifiers = ref<Room[]>([]);
const zone_rooms = ref<Room[]>([]);

const initial_data = computed<any>(() => {
  return {
    room: store.state.builder.room
  };
});

const path_rooms_endpoint = `builder/worlds/${route.params.world_id}/paths/${route.params.path_id}/rooms/`;

const endpoint_filters = { zone: route.params.zone_id };
const path_room_schema = BUILDER_FORMS.ZONE_PATH_ROOM;
const room = computed(() => store.state.builder.room);
const zone = computed(() => store.state.builder.zone);
const map = computed(() => {
  if (!path_rooms.value || !store.state.builder.map) return null;

  const builderMap = { ...store.state.builder.map };

  room_modifiers.value = [];
  for (const room of path_rooms.value) {
    room_modifiers.value.push({ ...builderMap[room.key], flags: ["smob"] });
  }

  return builderMap;
});

const mapReady = computed(() => map.value && zone.value && room.value && path.value);

const onClickRoom = async (room) => {
  store.commit('builder/room_set', room);

  if (room.zone.id != route.params.zone_id) {
    // Update route
    router.push({
      name: 'builder_zone_index',
      params: {
        zone_id: room.zone.id,
        world_id: route.params.world_id
      }
    });

    // Update zone
    store.dispatch('builder/zone_fetch', {
      world_id: route.params.world_id,
      zone_id: route.params.zone_id
    });
  }
};

onMounted(async () => {

  const zone_rooms_promise = store.dispatch('builder/zone_rooms_fetch', {
    world_id: route.params.world_id,
    zone_id: route.params.zone_id,
  });
  const fetchPathPromise = store.dispatch('builder/path_fetch', {
    world_id: route.params.world_id,
    path_id: route.params.path_id
  });

  const [
    zone_rooms_resp,
    path_resp
  ] = await Promise.all([
    zone_rooms_promise,
    fetchPathPromise
  ]);

  zone_rooms.value = zone_rooms_resp;
  path.value = path_resp;
  path_rooms.value = path_resp.rooms;

  if (path_rooms.value.length && !path_rooms.value.find(_room => _room.key == room.value.key)) {
    store.commit('builder/room_set', path_rooms.value[0]);
  }

});

const onAddRoom = (path_room) => {
  const room_key = path_room.room.key;
  const room = store.state.builder.map[room_key];
  store.commit("builder/path_rooms_add", room);
  store.commit("builder/room_set", room);
};

const onRemoveRoom = (path_room) => {
  const removedRoom = path_room.room;
  store.commit("builder/path_rooms_delete", removedRoom);

  if (removedRoom.key == room.value.key) {
    if (path_rooms.value.length) {
      store.commit("builder/room_set", path_rooms.value[0]);
    } else {
      store.commit("builder/room_set", store.state.builder.zone_rooms[0]);
    }
  }
};

const onClickPathRoom = (path_room) => {
  const room_key = path_room.room.key;
  const room = store.state.builder.map[room_key];
  store.commit("builder/room_set", room);
};

const editInfo = () => {
  const modal = {
    title: `Path ${path.value.id}`,
    data: store.state.builder.path,
    schema: BUILDER_FORMS.ZONE_PATH_DETAILS,
    action: "builder/path_save"
  };
  store.commit('ui/modal/open_form', modal);
};

const deletePath = () => {
  store.dispatch('builder/path_delete');
};
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

h2 {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.map-and-rooms {
  display: flex;
  flex-direction: column;

  @media ($desktop-site) {
    flex-direction: row;
    .path-rooms {
      margin-left: 20px;
    }
  }

  .path-rooms-map {
  }
}
</style>