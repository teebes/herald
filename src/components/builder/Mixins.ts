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
  }
}

@Component
export class OutsideClick extends Vue {
  mounted() {
    document.body.addEventListener("click", this.onOutsideClick);
  }

  destroyed() {
    document.body.removeEventListener("click", this.onOutsideClick);
  }

  // Overwrite in class mixing this in
  onOutsideClick(event) {}
}
