<template>
  <div id="mob-loads">
    <h3>MOB LOADED BY</h3>
    <ul v-for="loader in loaders" :key="loader.id" class='list'>
      <li>
        <router-link :to="loader_link(loader)">{{ loader.name }}</router-link>
      </li>
    </ul>
    <button class="btn-add" @click="onAddLoad">LOAD MOB IN {{ room.name.toUpperCase() }}</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

const loaders = computed(() => store.state.builder.worlds.mob_template_loads);
const template = computed(() => store.state.builder.worlds.mob_template);
const room = computed(() => store.state.builder.room);

const loader_link = (loader) => {
  return {
    name: 'builder_zone_loader_details',
    params: {
      world_id: route.params.world_id,
      loader_id: loader.id,
      zone_id: loader.zone.id
    }
  };
}

onMounted(() => {
  store.dispatch("builder/worlds/mob_template_loads_fetch", {
    world_id: route.params.world_id,
    mob_template_id: route.params.mob_template_id
  });
});

const onAddLoad = async () => {
  const room = store.state.builder.room;

  // Crude confirm dialog
  const c = confirm(`Load ${template.value.name} in ${room.name}?`);
  if (!c) return;

  const loader = await store.dispatch("builder/worlds/mob_template_load_in_room", {
    world_id: route.params.world_id,
    mob_template_id: route.params.mob_template_id,
    room_id: room.id
  });
  router.push({
    name: 'builder_zone_loader_details',
    params: {
      world_id: route.params.world_id,
      zone_id: loader.zone.id,
      loader_id: loader.id
    }
  });
  store.commit("ui/notification_set", `Loader ${loader.name} created.`);
};
</script>
