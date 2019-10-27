<template>
  <div>
    <div>
      Death room:
      <router-link :to="death_room_link">{{ resource.room.name }}</router-link>
    </div>

    <div>
      Faction:
      <router-link :to="factions_link">{{ resource.faction.name }}</router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import { BUILDER_ROOM_INDEX, BUILDER_WORLD_FACTIONS } from "@/router";

@Component
export default class ZoneProcessionDetail extends Mixins(ZoneView) {
  @Prop() resource!: any;

  get death_room_link() {
    return {
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: this.$route.params.world_id,
        room_id: this.resource.room.id
      }
    };
  }

  get factions_link() {
    return {
      name: BUILDER_WORLD_FACTIONS
    };
  }
}
</script>