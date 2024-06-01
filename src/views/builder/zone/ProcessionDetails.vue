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

<script lang='ts' setup>
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps<{
  resource: any;
}>();

const death_room_link = {
  name: 'builder_room_index',
  params: {
    world_id: route.params.world_id,
    room_id: props.resource.room.id
  }
};

const factions_link = {
  name: 'builder_world_faction_list',
  params: {
    world_id: route.params.world_id,
  }
}

</script>