<template>
  <div id="item-loads">
    <h3>ITEM LOADED BY</h3>

    <ul class="list" v-if="loaders.length || mob_templates.length || item_templates.length">
      <li v-for="loader in loaders" :key="loader.id">
        <router-link :to="loader_link(loader)">{{ loader.name }}</router-link>
      </li>
      <li v-for="mob_template in mob_templates" :key="mob_template.id">
        <router-link :to="mob_template_link(mob_template)">{{ mob_template.name }}</router-link>
      </li>
      <li v-for="item_template in item_templates" :key="item_template.id">
        <router-link :to="item_template_link(item_template)">{{ item_template.name }}</router-link>
      </li>
    </ul>

    <button class="btn-add" @click="onAddLoad">LOAD ITEM IN {{ room.name.toUpperCase() }}</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

// const loaders = computed(() => store.state.builder.worlds.item_template_loads);
const loads = computed(() => store.state.builder.worlds.item_template_loads);
const loaders = computed(() => {
  return loads.value.loaders || [];
});
const mob_templates = computed(() => {
  return loads.value.mob_templates || [];
})
const item_templates = computed(() => {
  return loads.value.item_templates || [];
})

const template = computed(() => store.state.builder.worlds.item_template);
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
};

const mob_template_link = (mob_template) => {
  return {
    name: 'builder_mob_template_details',
    params: {
      world_id: route.params.world_id,
      mob_template_id: mob_template.id
    }
  };
};

const item_template_link = (item_template) => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: route.params.world_id,
      item_template_id: item_template.id
    }
  };
};

onMounted(() => {
  store.dispatch("builder/worlds/item_template_loads_fetch", {
    world_id: route.params.world_id,
    item_template_id: route.params.item_template_id
  });
});

const onAddLoad = async () => {
  const room = store.state.builder.room;

  // Crude confirm dialog
  const c = confirm(`Load ${template.value.name} in ${room.name}?`);
  if (!c) return;

  const loader = await store.dispatch("builder/worlds/item_template_load_in_room", {
    world_id: route.params.world_id,
    item_template_id: route.params.item_template_id,
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
