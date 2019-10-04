import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";
import { KeepAliveFetch } from "@/components/Mixins.ts";

@Component
export default class extends Mixins(KeepAliveFetch) {
  async fetch() {
    // When we activate any world view, we want to know show the information if
    // we have it, otherwise wait for it. In both cases, we trigger a fetch
    // so that we can update our world data.
    if (
      !this.$store.state.builder.room ||
      this.$store.state.builder.room != this.$route.params.room_id
    ) {
      const room = await this.$store.dispatch(BUILDER_ACTIONS.ROOM_FETCH, {
        world_id: this.$route.params.world_id,
        room_id: this.$route.params.room_id
      });

      if (
        !this.$store.state.builder.zone ||
        this.$store.state.builder.zone != room.zone.id
      ) {
        await this.$store.dispatch(BUILDER_ACTIONS.ZONE_FETCH, {
          world_id: this.$route.params.world_id,
          zone_id: room.zone.id
        });
      }
    }
  }
}
