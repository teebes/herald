<template>
  <div v-if="zone">
    <h2 class="zone-name entity-title">{{ zone.name }}</h2>

    <div v-if="zone_rooms.length">
      <div>here</div>
      <Map :rooms="zone_rooms" />
    </div>
  </div>
  <div v-else class="loading-screen">Loading...</div>
</template>


<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { BUILDER_ACTIONS } from "@/constants";
import Map from "../Map.vue";
import axios from "axios";

@Component({
  components: {
    Map
  }
})
export default class extends Vue {
  zone_rooms: Array<any> = [];

  async mounted() {
    await this.$store.dispatch(BUILDER_ACTIONS.ZONE_FETCH, {
      world_id: this.$route.params.world_id,
      zone_id: this.$route.params.zone_id
    });

    const resp = await axios.get(
      `builder/worlds/${this.$route.params.world_id}/zones/${this.$route.params.zone_id}/map/`
    );
    this.zone_rooms = resp.data.data;
  }

  get zone() {
    return this.$store.state.builder.zone;
  }
}
</script>