<template>
  <div class="indented">
    <h3 class="my-2">{{ message.data.players.length }} PLAYERS IN WORLD</h3>
    <div v-for="player in message.data.players" :key="player.id" :class="playerClasses(player)">

      <span v-if="viewer.is_immortal && player.core_faction" class="ml-2 color-text-50">[ {{ player.core_faction }} ]</span>
      {{ player.name }} {{ player.title }} ({{ player.level }})
      <span v-if="player.clan" class="ml-2">[ {{ player.clan.name }} ]</span>
      <span v-if="player.is_invisible" class="ml-1 color-text-50">[invisible]</span>
      <span v-if="player.is_linkless" class="ml-1">[<span class="color-text-red">LINKLESS</span>]</span>
      <span v-if="player.link_id" class="ml-2 color-text-50">[ link {{ player.link_id }} ]</span>
      <span v-if="player.room_id" class="ml-2 color-text-50">[ {{ player.room_id}} ]</span>
      <span v-if="player.is_idle" class="ml-2 color-text-50">(Idle)</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
defineProps<{
  message: any;
  distanceToBottom: number;
}>();

const viewer = computed(() => store.state.game.player);

const playerClasses = (player) => {
  if (player.is_immortal)
    return {"color-primary": true}
  else if (player.name_recognition)
    return {"color-secondary": true}
  else
    return {}
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.gworld-name-and-count {
  &:hover {
    cursor: pointer;
  }
}
</style>
