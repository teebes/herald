<template>
  <div>
    Available exits:
    <template v-if="Object.keys(message.data).length">
      <div v-for="(room_data, direction) in message.data" :key="direction">
        {{ direction }} - {{ room_data.name }}
        <span
          v-if="player.is_immortal"
          class="color-text-50 ml-4"
        >[ {{ room_data.id }} ]</span>
      </div>
    </template>
    <div v-else>None.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const player = computed(() => store.state.game.player);

defineProps<{message: any}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>