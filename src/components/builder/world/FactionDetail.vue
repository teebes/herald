<template>
  <div>
    <div>{{ resource.name }} ({{ resource.code }})</div>
    <div v-if="resource.death_rooms.length" class="mt-4">
      <div>Death Rooms:</div>
      <ul class="list">
        <li v-for="room in resource.death_rooms" :key="room.id">
          <router-link to="room_link(room)">{{ room.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/world/WorldView.ts";
import { BUILDER_ROOM_INDEX } from "@/router";

@Component
export default class Builder extends Vue {
  @Prop() resource!: any;

  room_link(room) {
    return {
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: this.$route.params.world_id,
        room_id: room.id
      }
    };
  }
}
</script>