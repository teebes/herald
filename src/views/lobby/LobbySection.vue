<template>
  <div id="page">

    <router-link class="gray-link" :to="{ name: 'lobby' }">Back to Lobby</router-link>

    <h1 class="section-title">{{ sectionName }}</h1>

    <div v-if="section == 'public'" class='public-worlds'>
      <div class="public-world flex mb-4" v-for="world in worlds" :key="world.id">
        <WorldCard :world="world"/>
        <div class="world-description ml-4 color-text-70">
            <div class="desc-line" v-for="(line, index) of descLines(world.description)" :key="index">
              {{ line }}
            </div>
            <div class="description-overlay"></div>
        </div>
      </div>
    </div>

    <div v-else class="section-worlds flex flex-row flex-wrap justify-around">
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
const section = router.currentRoute.value.params.section;

onMounted(async () => {
  let endpoint;
  if (router.currentRoute.value.params.section === 'playing') {
    endpoint = 'lobby/worlds/playing/?page_size=100';
  } else if (router.currentRoute.value.params.section === 'building') {
    endpoint = 'lobby/worlds/building/?page_size=100';
  } else if (router.currentRoute.value.params.section === 'reviewed') {
    endpoint = 'lobby/worlds/reviewed/?page_size=100';
  } else if (router.currentRoute.value.params.section === 'public') {
    endpoint = 'lobby/worlds/public/?page_size=100';
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
  } else if (router.currentRoute.value.params.section === 'public') {
    return 'Public Worlds';
  }
  return "Invalid Section";
});

const descLines = (desc: string) => desc.split("\n");
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

.public-worlds {
  .public-world {
    .world-card {
      width: 370px;
      min-width: 370px;
      height: 166px;
    }

    .world-description {
      max-height: 166px;
      overflow-y: hidden;
      position: relative;

      div.desc-line:not(:last-child) {
        margin-bottom: 0.8em;
      }
    }

    .description-overlay {
      // background: linear-gradient(to bottom,
      //   $color-transparent-rgba 0%,
      //   $color-transparent-rgba 50%, /* Make the first 90% transparent */
      //   $color-background-rgba 100% /* Add the background color in the last 10% */
      // );
      // position: absolute;
      // width: 100%;
      // height: 166px;
      // top: 0;

      background: linear-gradient(to bottom,
          $color-transparent-rgba,
          $color-background-rgba 100%);
      position: absolute;
      width: 100%;
      height: 40px;
      bottom: 0;
    }
  }
}

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