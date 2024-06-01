<template>
  <ModalView id="coms_log">
    <h1 class="mb-6">Communication Log</h1>
    <template v-if="log_entries.length">
      <div v-for="(entry, index) in log_entries" :key="index">{{ entry.text }}</div>
    </template>
    <div v-else>No communication entries. You can send game-wide messages with the 'chat' command.</div>
  </ModalView>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import ModalView from "@/components/ui/ModalView.vue";

const store = useStore();

const log_entries = computed(() => store.state.game.com_list.slice().reverse());

</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
