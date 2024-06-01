<template>
  <div id="page">

    <router-link class="gray-link" :to="{ name: 'lobby' }">Back to Lobby</router-link>

    <h1 class="section-title">{{ sectionName }}</h1>
    <div class="section-worlds flex flex-row flex-wrap justify-around">
      <WorldCard v-for="world in worlds" :key="world.id" :world="world"/>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { World } from "@/core/interfaces";
import WorldCard from "@/components/lobby/WorldCard.vue";

const router = useRouter();

const worlds = ref<World[]>([]);

onMounted(async () => {
  let endpoint;
  if (router.currentRoute.value.params.section === 'playing') {
    endpoint = 'lobby/worlds/playing/?page_size=100';
  } else if (router.currentRoute.value.params.section === 'building') {
    endpoint = 'lobby/worlds/building/?page_size=100';
  } else if (router.currentRoute.value.params.section === 'reviewed') {
    endpoint = 'lobby/worlds/reviewed/?page_size=100';
  } else {
    router.push({ name: 'lobby' });
  }

  const resp = await axios.get(endpoint);
  worlds.value = resp.data.results;
});

const sectionName = computed(() => {
  if (router.currentRoute.value.params.section === 'playing') {
    return 'Playing Worlds';
  } else if (router.currentRoute.value.params.section === 'building') {
    return 'Building Worlds';
  } else if (router.currentRoute.value.params.section === 'reviewed') {
    return 'Reviewed Worlds';
  }
  return "Invalid Section";
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

.section-worlds {
  .world-card {
    transform: scale(0.95);
    margin-bottom: 1rem;
  }

  @media (max-width: $lobby-breakpoint) {
    align-items: center;
    flex-direction: column;
  }
}
</style>