import { Component, Vue } from "vue-property-decorator";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";

@Component
export class MapRoomClick extends Vue {
  // overload on classes that use mixing to provide
  // custom post click hook
  postMapClickRoom(room) {}

  onMapClickRoom(room) {
    /* 
            When a room is clicked on a map, first we set
            the builder's room to the event's data, and then
            we issue a dispatch for the latest room data,
            to both mark that it was the last room as well as
            update its data, if another builder has made a
            change to it.
        */

    this.$store.dispatch(BUILDER_ACTIONS.ROOM_SELECT, room);

    if (this.postMapClickRoom) {
      this.postMapClickRoom(room);
    }
    return;

    // Update store
    this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, room);

    // Dispatch fetch
    this.$store.dispatch(BUILDER_ACTIONS.ROOM_FETCH, {
      world_id: this.$route.params.world_id,
      room_id: room.id
    });

    // If the clicked room is taking us to a new zone,
    // dispatch to get that as well
    if (room.zone.id != this.$store.state.builder.zone.id) {
      // Clear the zone's rooms since they will be refetched
      this.$store.commit(BUILDER_MUTATIONS.ZONE_ROOMS_CLEAR);
      this.$store.dispatch(BUILDER_ACTIONS.ZONE_FETCH, {
        world_id: this.$route.params.world_id,
        zone_id: room.zone.id
      });
    }

    if (this.postMapClickRoom) {
      this.postMapClickRoom(room);
    }
  }
}

@Component
export class OutsideClick extends Vue {
  mounted() {
    document.body.addEventListener("click", this.onOutsideClick);
  }

  unmounted() {}

  activated() {
    document.body.addEventListener("click", this.onOutsideClick);
  }

  deactivated() {
    document.body.removeEventListener("click", this.onOutsideClick);
  }

  // Overwrite in class mixing this in
  onOutsideClick(event) {}
}
