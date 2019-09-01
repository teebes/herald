<template>
  <div id="mob-quests" v-if="loaded">
    <h3>USED BY QUESTS</h3>
    <ul v-for="quest in quests" :key="quest.id">
      <li>
        <router-link :to="quest_link(quest)">{{ quest.name }}</router-link>
      </li>
    </ul>
    <div v-if="!quests.length">No quest uses this mob.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_ZONE_QUEST_DETAIL } from "@/router";
import { KeepAliveFetch } from "@/components/Mixins.ts";

@Component
export default class MobTemplateQuests extends Mixins(KeepAliveFetch) {
  loaded: boolean = false;

  get quests() {
    return this.$store.state.builder.worlds.mob_template_quests;
  }

  quest_link(quest) {
    return {
      name: BUILDER_ZONE_QUEST_DETAIL,
      params: {
        world_id: this.$route.params.world_id,
        zone_id: quest.zone.id,
        quest_id: quest.id
      }
    };
  }

  async fetch() {
    this.$store.dispatch("builder/worlds/mob_template_quests_fetch", {
      world_id: this.$route.params.world_id,
      mob_template_id: this.$route.params.mob_template_id
    });
    this.loaded = true;
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>