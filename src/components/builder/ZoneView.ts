import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import store from "@/store";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";
import { BUILDER_ZONE_INDEX } from "@/router";
import router from "@/router";
import { KeepAliveFetch } from "@/components/Mixins.ts";

@Component
export default class extends Mixins(KeepAliveFetch) {
  async activated() {
    this.selectZone(this.$route.params.zone_id);
  }

  async selectZone(zone_id) {
    // If the current builder zone is not the one requested by the route, fetch
    // the new zone.
    if (
      !this.$store.state.builder.zone ||
      this.$store.state.builder.zone.id != zone_id
    ) {
      const zone = await this.$store.dispatch(BUILDER_ACTIONS.ZONE_FETCH, {
        world_id: this.$route.params.world_id,
        zone_id: zone_id
      });

      // When selecting a zone different from the selected room, or if there
      // is no selected room, set it to the center of the zone.
      // This happens for example when jumping into a new zone via a link.
      if (
        !this.$store.state.builder.room ||
        this.$store.state.builder.room.zone.id != zone_id
      ) {
        this.$store.commit(BUILDER_MUTATIONS.ROOM_SET, zone.center);
      }
    }
  }

  async onClickRoom(room) {
    store.commit(BUILDER_MUTATIONS.ROOM_SET, room);

    if (room.zone.id != router.currentRoute.params.zone_id) {
      // Update route
      router.push({
        name: BUILDER_ZONE_INDEX,
        params: {
          zone_id: room.zone.id,
          world_id: router.currentRoute.params.world_id
        }
      });

      // Update zone
      store.dispatch(BUILDER_ACTIONS.ZONE_FETCH, {
        world_id: router.currentRoute.params.world_id,
        zone_id: router.currentRoute.params.zone_id
      });
    }
  }
}
