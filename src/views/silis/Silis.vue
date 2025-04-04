<template>
  <div v-if="!player" class="loading-container">
    <div class="spinner"></div>
  </div>

  <div v-if="player" class="silis-container flex flex-grow flex-col w-full mx-auto relative">

    <!-- Room name and map row -->
    <div class="flex">
      <!-- Room Info-->
      <div class="room-info p-4 flex flex-grow justify-center items-center">
        <h2 class="uppercase">{{ room.name }}</h2>
      </div>

      <Map class="" :radius="1" :map="map" :unit="8" :center_id="player.room_id"
        @clickRoom="onRoomClick" />
    </div>

    <div class="flex flex-grow p-4">
      Room description or expanded map (if map is expanded, its minimized location is replaced with an upward triangle).
      Then towards the bottom, input / actions (exits?)
    </div>

    <div class="items-and-mobs">
      <div v-for="mob in mobs" :key="mob.id">
        {{ mob.room_description }}
      </div>
    </div>

    <div class="flex p-4">
      Actions
    </div>

    <Footer :selectedTab="selectedTab" />
  </div>

</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Map from "@/components/silis/Map.vue";
import Footer from "@/components/silis/Footer.vue";

const route = useRoute();
const store = useStore();

const selectedTab = ref('look');

const player = computed(() => store.getters['silis/getPlayer']);
const room = computed(() => store.getters['silis/getRoom']);
const map = computed(() => store.getters['silis/getMap']);
const mobs = computed(() => store.getters['silis/getMobs']);

const onRoomClick = (room) => {
  console.log('room clicked', room);
}

onMounted(() => {
  store.dispatch('silis/bootstrap', route.params.player_id);
});
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.silis-container {
  max-width: 768px;
}
</style>