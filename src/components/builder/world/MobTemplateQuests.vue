<template>
  <div id="mob-quests" v-if="loaded">
    <h3>USED BY QUESTS</h3>
    <ul v-for="quest in quests" :key="quest.id" class='list'>
      <li>
        <router-link :to="quest_link(quest)">{{ quest.name }}</router-link>
      </li>
    </ul>
    <div v-if="!quests.length">No quest uses this mob.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const loaded = ref(false);

const quests = computed(() => store.state.builder.worlds.mob_template_quests);

const quest_link = (quest) => {
  return {
    name: 'builder_zone_quest_details',
    params: {
      world_id: route.params.world_id,
      zone_id: quest.zone.id,
      quest_id: quest.id
    }
  };
};
onMounted(async () => {
  await store.dispatch("builder/worlds/mob_template_quests_fetch", {
    world_id: route.params.world_id,
    mob_template_id: route.params.mob_template_id
  });
  loaded.value = true;
});
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>