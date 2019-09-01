<template>
  <div id="room-loads">
    <h2>ROOM LOADS</h2>

    <template v-if="fetched && loaders.length">
      <div class="loader" v-for="loader_info in loaders" :key="loader_info.loader.id">
        <h3>{{ loader_info.loader.name }}</h3>

        <div v-if="loader_info.room.mobs.length">Mobs in room:
          <ul class="list">
            <li v-for="mob in loader_info.room.mobs" :key="mob.id">
              <router-link :to="mob_template_link(mob)">{{ mob.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.room.items.length">Items in room:
          <ul class="list">
            <li v-for="item in loader_info.room.items" :key="item.id">
              <router-link :to="item_template_link(item)">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.path.mobs.length">Mobs in path:
          <ul class="list">
            <li v-for="mob in loader_info.path.mobs" :key="mob.id">
              <router-link :to="mob_template_link(mob)">{{ mob.name }}</router-link>
            </li>
          </ul>
        </div>

        <div v-if="loader_info.path.items.length">Items in path:
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

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";

import RoomView from "@/components/builder/room/RoomView.ts";
import {
  BUILDER_ZONE_LOADER_DETAILS,
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_ITEM_TEMPLATE_DETAILS
} from "@/router.ts";

@Component
export default class RoomLoads extends Mixins(RoomView) {
  loaders: {}[] = [];
  fetched: boolean = false;

  BUILDER_ZONE_LOADER_DETAILS: string = BUILDER_ZONE_LOADER_DETAILS;
  BUILDER_MOB_TEMPLATE_DETAILS: string = BUILDER_MOB_TEMPLATE_DETAILS;
  BUILDER_ITEM_TEMPLATE_DETAILS: string = BUILDER_ITEM_TEMPLATE_DETAILS;

  async activated() {
    const resp = await axios.get(
      `/builder/worlds/${this.$route.params.world_id}/rooms/${
        this.$route.params.room_id
      }/loads/`
    );
    this.loaders = resp.data.loaders;
    this.fetched = true;
  }

  mob_template_link(mob) {
    return {
      name: BUILDER_MOB_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        mob_template_id: mob.id
      }
    };
  }

  item_template_link(item) {
    return {
      name: BUILDER_ITEM_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        item_template_id: item.id
      }
    };
  }

  loader_link(loader) {
    return {
      name: BUILDER_ZONE_LOADER_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        zone_id: loader.zone.id,
        loader_id: loader.id
      }
    };
  }
}
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