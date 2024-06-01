<template>
  <div id="room-loads">
    <h2>ROOM LOADS</h2>

    <template v-if="fetched && loaders.length">
      <div class="loader mb-8" v-for="loader_info in loaders" :key="loader_info.loader.id">
        <h3>{{ loader_info.loader.name }}</h3>

        <div v-if="loader_info.room.mobs.length">
          Mobs in room:
          <ul class="list">
            <li v-for="mob in loader_info.room.mobs" :key="mob.id">
              <router-link :to="mob_template_link(mob)">{{ mob.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.room.items.length">
          Items in room:
          <ul class="list">
            <li v-for="item in loader_info.room.items" :key="item.id">
              <router-link :to="item_template_link(item)">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.path.mobs.length">
          Mobs in path:
          <ul class="list">
            <li v-for="mob in loader_info.path.mobs" :key="mob.id">
              <router-link :to="mob_template_link(mob)">{{ mob.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.path.items.length">
          Items in path:
          <ul class="list">
            <li v-for="item in loader_info.path.items" :key="item.id">
              <router-link :to="item_template_link(item)">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="goto-loader">
          <router-link :to="loader_link(loader_info.loader)">Go to {{ loader_info.loader.name }}</router-link>
        </div>
      </div>
    </template>
    <div v-else-if="fetched">No loads defined for this room.</div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();

const loaders = ref<any[]>([]);
const fetched = ref(false);

onMounted(async () => {
  const resp = await axios.get(
    `/builder/worlds/${route.params.world_id}/rooms/${route.params.room_id}/loads/`
  );
  loaders.value = resp.data.loaders;
  fetched.value = true;
});

const mob_template_link = (mob: any) => {
  return {
    name: 'builder_mob_template_details',
    params: {
      world_id: route.params.world_id,
      mob_template_id: mob.id
    }
  };
};

const item_template_link = (item: any) => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: route.params.world_id,
      item_template_id: item.id
    }
  };
};

const loader_link = (loader: any) => {
  return {
    name: 'builder_zone_loader_details',
    params: {
      world_id: route.params.world_id,
      zone_id: loader.zone.id,
      loader_id: loader.id
    }
  };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#room-loads {
  h2 {
    margin-bottom: 20px;
  }

  h3 {
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  li > a {
    color: inherit;
  }
}
</style>