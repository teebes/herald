<template>
  <div id="room-details" v-if="room">
    <h2 class="entity-title">{{ room.name }}</h2>

    <div v-if="isMapReady" class="info-and-map">
      <div class="id-map-coords">
        <div class="id-and-coords">
          <div class="room-id" :title="room.key">{{ room.id }}</div>
          <div class="room-coordinates">({{ room.x }}, {{ room.y }}, {{ room.z}})</div>
        </div>
        <Map
          v-if="isMapReady"
          :map="$store.state.builder.map"
          :center_key="$store.state.builder.room.key"
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

    <RoomActions />

    <div class="mt-8" v-if="room.note">
      <h3>ROOM NOTE</h3>
      <div>{{ room.note }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import Map from "@/components/Map.vue";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";
import RoomActions from "@/components/builder/room/RoomActions.vue";
import RoomView from "@/components/builder/room/RoomView";
import RoomDescriptionModal from "@/components/builder/room/RoomDescriptionModal.vue";
import { BUILDER_FORMS } from "@/core/forms";
import { MapRoomClick } from "@/components/builder/Mixins.ts";
import { BUILDER_ROOM_INDEX } from "@/router";
import { FormElement } from "@/core/forms";
import RoomDescription from "@/components/builder/room/RoomDescription.vue";

@Component({
  components: {
    Map,
    RoomActions,
    RoomDescription
  }
})
export default class RoomDetails extends Mixins(MapRoomClick, RoomView) {
  get room() {
    return this.$store.state.builder.room;
  }

  get isMapReady() {
    return Boolean(
      this.$store.state.builder.room && this.$store.state.builder.map
    );
  }

  get room_info_schema() {
    return BUILDER_FORMS.ROOM_INFO;
  }

  onTypeE(e) {
    if (this.$store.state.ui.modal) return;
    const key = String.fromCharCode(e.keyCode).toLowerCase();
    if (key === "e") this.editInfo();
  }

  async mounted() {
    window.addEventListener("keypress", this.onTypeE);
  }
  destroyed() {
    let x = 1;
    window.removeEventListener("keypress", this.onTypeE);
  }

  editInfo() {
    const modal = {
      data: this.room,
      schema: BUILDER_FORMS.ROOM_INFO,
      action: "builder/room_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteRoom() {
    const room_id = this.$store.state.builder.room.id;

    // Crude confirm dialog
    const c = confirm(`Are you sure you want to delete Room ${room_id}?`);
    if (!c) return;

    await this.$store.dispatch("builder/room_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Room ${room_id}`
    );
  }

  postMapClickRoom(room) {
    this.$router.push({
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: this.$route.params.world_id,
        zone_id: this.$route.params.zone_id,
        room_id: room.id
      }
    });
  }

  onEditDescription() {
    const schema: FormElement[] = [
      {
        attr: "description",
        label: "Description",
        widget: "textarea"
      }
    ];

    const modal = {
      class: "description-modal",
      data: this.$store.state.builder.room,
      schema: [BUILDER_FORMS.DESCRIPTION],
      action: "builder/room_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
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
}
</style>