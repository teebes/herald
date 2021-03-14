<template>
  <div id="mob-loads">
    <h3>MOB LOADED BY</h3>
    <ul v-for="loader in loaders" :key="loader.id" class='list'>
      <li>
        <router-link :to="loader_link(loader)">{{ loader.name }}</router-link>
      </li>
    </ul>
    <button class="btn-add" @click="onAddLoad">LOAD MOB IN {{ $store.state.builder.room.name.toUpperCase() }}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_ZONE_LOADER_DETAILS } from "@/router";
import { KeepAliveFetch } from "@/components/Mixins.ts";

@Component
export default class MobTemplateLoads extends Mixins(KeepAliveFetch) {
  get loaders() {
    return this.$store.state.builder.worlds.mob_template_loads;
  }

  get template() {
    return this.$store.state.builder.worlds.mob_template;
  }

  loader_link(loader) {
    return {
      name: BUILDER_ZONE_LOADER_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        loader_id: loader.id,
        zone_id: loader.zone.id
      }
    };
  }

  async mounted() {
    this.fetch();
  }

  async fetch() {
    this.$store.dispatch("builder/worlds/mob_template_loads_fetch", {
      world_id: this.$route.params.world_id,
      mob_template_id: this.$route.params.mob_template_id
    });
  }

  async onAddLoad() {
    const room = this.$store.state.builder.room;

    // Crude confirm dialog
    const c = confirm(`Load ${this.template.name} in ${room.name}?`);
    if (!c) return;

    const loader = await this.$store.dispatch(
      "builder/worlds/mob_template_load_in_room",
      {
        world_id: this.$route.params.world_id,
        mob_template_id: this.$route.params.mob_template_id,
        room_id: room.id
      }
    );
    this.$router.push({
      name: BUILDER_ZONE_LOADER_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        zone_id: loader.zone.id,
        loader_id: loader.id
      }
    });
    this.$store.commit("ui/notification_set", `Loader ${loader.name} created.`);
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>