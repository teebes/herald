<template>
  <div id="world_lobby" v-if="uniques_data">
    <h1 class='mt-8'>
      <router-link
            :to="{name: 'lobby_world_details', params: {world_id: 1}}"
          >LOBBY</router-link>
      <span class='mx-2'>&mdash;</span>
      EDEUS UNIQUE BEARERS
    </h1>

    <div class='color-text-50'>Last updated: {{ new Date(uniques_data.run_ts).toLocaleDateString() }}</div>

    <div class='unique-bearer'>
      <h2>Thune's Hammer</h2>
      <div class='name-and-title'>{{ uniques_data.warrior.name }} {{ uniques_data.warrior.title }}</div>
      <div class='faction-and-class'>{{ uniques_data.warrior.core_faction }} Warrior</div>
    </div>

    <div class='unique-bearer'>
      <h2>The Sunken Blade</h2>
      <div class='name-and-title'>{{ uniques_data.assassin.name }} {{ uniques_data.assassin.title }}</div>
      <div class='faction-and-class'>{{ uniques_data.assassin.core_faction }} Assassin</div>
    </div>

    <div class='unique-bearer'>
      <h2>The Staff of Neredae</h2>
      <div class='name-and-title'>{{ uniques_data.mage.name }} {{ uniques_data.mage.title }}</div>
      <div class='faction-and-class'>{{ uniques_data.mage.core_faction }} Mage</div>
    </div>

    <div class='unique-bearer'>
      <h2>Arkosh's Scepter</h2>
      <div class='name-and-title'>{{ uniques_data.cleric.name }} {{ uniques_data.cleric.title }}</div>
      <div class='faction-and-class'>{{ uniques_data.cleric.core_faction }} Cleric</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const uniques_data: any = ref(null);

onMounted(async () => {
  const resp = await axios.get("/lobby/worlds/1/uniques/");
  uniques_data.value = resp.data;
});

</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
#world_lobby {
  padding: 0 20px;

  .unique-bearer {
    margin-top: 20px;

    .faction-and-class {
      color: $color-text-hex-50;
    }
  }
}
</style>