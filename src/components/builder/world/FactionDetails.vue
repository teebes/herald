<template>
  <div>
    <div>{{ resource.name }} ({{ resource.code }}) <span class='color-text-50 ml-2' v-if="resource.is_core">[ CORE ]</span></div>
    <!-- Death Rooms -->
    <div v-if="resource.death_rooms && resource.death_rooms.length" class="mt-4">
      <h3>DEATH ROOMS</h3>
      <ul class="list">
        <li v-for="room in resource.death_rooms" :key="room.id">
          <router-link :to="room_link(room)">{{ room.name }}</router-link>
        </li>
      </ul>
    </div>
    <!-- Faction Ranks -->
    <div v-if="!resource.is_core" class="mt-4">
      <h3>RANKS</h3>

      <div class="pl-2">
        <table v-if="resource.ranks && resource.ranks.length">
          <tbody>
            <tr v-for="rank in resource.ranks" :key="rank.id">
              <td>{{ rank.name }}</td>
              <td class="pl-4 color-text-50">[ {{ rank.standing }} ]</td>
            </tr>
          </tbody>
        </table>
        <div v-else>No ranks defined.</div>
        <router-link :to="faction_ranks_link(resource)">manage ranks</router-link>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";

const route = useRoute();

defineProps<{
  resource: any;
}>();

const room_link = (room: any) => {
  return {
    name: 'builder_room_index',
    params: {
      world_id: route.params.world_id,
      room_id: room.id
    }
  };
};

const faction_ranks_link = (faction: any) => {
  return {
    name: 'builder_world_faction_rank_list',
    params: {
      world_id: route.params.world_id,
      faction_id: faction.id
    }
  };
};
</script>

<style lang='scss'>
h3 {
  font-size: 0.9em;
}
ul.list {
  margin-bottom: 0;
}
</style>