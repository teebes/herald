<template>
  <div v-if="path">
    <h2>
      {{ $store.state.builder.path.name }} 
      <button class='btn-small'
              @click="editInfo">EDIT</button>
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

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import ZoneView from "@/components/builder/ZoneView";
import Map from "../Map.vue";
import axios from "axios";
import { 
  BUILDER_ACTIONS, 
  BUILDER_MUTATIONS, 
  UI_MUTATIONS } from "@/constants";
import { Room } from "@/core/interfaces";
import InColumnList from "@/components/incolumnlist/List.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";


@Component({
  components: {
    InColumnList,
    Map
  }
})
export default class extends Mixins(ZoneView) {
  /* 
    This view is tricky because the ElementList handles the PathRoom
    intermediary objects as the element, whereas in this view the path_rooms
    are a list of Room objects.
  */

  path: any = null;
  path_rooms: Array<Room> = [];
  room_modifiers: Array<Room> = [];
  zone_rooms: Array<Room> = [];

  get initial_data() {
    return {
      room: this.$store.state.builder.room
    };
  }

  get path_rooms_endpoint() {
    const world_id = this.$route.params.world_id;
    const path_id = this.$route.params.path_id;
    return `builder/worlds/${world_id}/paths/${path_id}/rooms/`;
  }

  get endpoint_filters() {
    return {
      zone: this.$route.params.zone_id
    };
  }

  get path_room_schema() {
    return BUILDER_FORMS.ZONE_PATH_ROOM;
  }

  get room() {
    return this.$store.state.builder.room;
  }

  get zone() {
    return this.$store.state.builder.zone;
  }

  get map() {
    if (!this.path.rooms || !this.$store.state.builder.map) return null;

    const builderMap = { ...this.$store.state.builder.map };

    this.room_modifiers = [];
    for (const room of this.path.rooms) {
      this.room_modifiers.push({ ...builderMap[room.key], flags: ["smob"] });
    }

    return builderMap;
  }

  get mapReady() {
    return this.map && this.zone && this.room && this.path;
  }

  async activated() {
    const path_id = this.$route.params.path_id;

    const fetchZoneRoomsPromise = this.$store.dispatch(
      BUILDER_ACTIONS.ZONE_ROOMS_FETCH,
      {
        world_id: this.$route.params.world_id,
        zone_id: this.$route.params.zone_id
      }
    );

    const fetchPathPromise = this.$store.dispatch(
      BUILDER_ACTIONS.PATH_FETCH,
      {
        world_id: this.$route.params.world_id,
        path_id: this.$route.params.path_id,
      }
    )

    const [zone_rooms_resp, path_resp] = await Promise.all([
      fetchZoneRoomsPromise, fetchPathPromise
    ])

    this.zone_rooms = zone_rooms_resp;
    this.path = path_resp;
    this.path_rooms = this.path.rooms;

    /*
    const world_id = this.$route.params.world_id,
      path_id = this.$route.params.path_id;
    const resp = await axios.get(
      `/builder/worlds/${world_id}/paths/${path_id}/`
    );
    this.path = resp.data;
    this.path_rooms = this.path.rooms;
    */

    // If the currently shown room does not belong to the path, set the shown
    // room to the the first room in the path instead.
    // This ensures that whenever we select a path, we are taken to somewhere
    // on path.
    if (this.path_rooms.length 
        && !this.path_rooms.find(room => room.key == this.room.key))
      this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, this.path_rooms[0]);
  }

  onAddRoom(path_room) {
    const room_key = path_room.room.key;
    const room = this.$store.state.builder.map[room_key];
    this.$store.commit(BUILDER_MUTATIONS.PATH_ROOMS_ADD, room);
    this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, room);
  }

  onRemoveRoom(path_room) {
    const removedRoom = path_room.room;
    this.$store.commit(BUILDER_MUTATIONS.PATH_ROOMS_DELETE, removedRoom);
    
    if (removedRoom.key == this.room.key) {
      if (this.path.rooms.length) {
        this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, this.path.rooms[0]);
      } else {
        this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, this.$store.state.builder.zone_rooms[0])
      }
    }
  }

  onClickPathRoom(path_room) {
    const room_key = path_room.room.key;
    const room = this.$store.state.builder.map[room_key];
    this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, room);
  }

  editInfo() {
    const modal = {
      title: `Path ${this.path.id}`,
      data: this.$store.state.builder.path,
      schema: BUILDER_FORMS.ZONE_PATH_DETAILS,
      action: BUILDER_ACTIONS.PATH_SAVE,
    }
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
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