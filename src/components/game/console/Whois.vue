<template>
  <div class='indented'>
   <div>{{ player.name }} {{ player.title }}</div>
   <div class='color-text-50'>
     Level {{ player.level }}
     <template v-if="player.gender == 'non_binary'">non-binary</template>
     <template v-else>{{ player.gender }}</template>
     {{ player.core_faction }} {{ player.archetype }}</div>
   <div v-for="faction_data in player.factions" :key="faction_data.id" class='color-text-60'>
     {{ faction_data.name }} {{ faction_data.rank}}
   </div>
   <div class="description mt-2" v-if="descLines.length">
      <div class="description-line" v-for="(line, index) in descLines" :key="index">{{ line }}</div>
   </div>
   <div v-if="store.state.auth.user.is_staff && player.email" class='color-text-50 mt-1 staff-info'>
     <div>
       Email: {{ player.email }}
       - <span v-if="player.is_confirmed">(confirmed)</span>
       <span v-else>(unconfirmed)</span>
      </div>
     <div>Player ID: {{ player.id }}</div>
     <div>User ID: {{ player.user_id }}</div>
     <div>Username: {{ player.username }}</div>
     <div v-if="player.alts.length">
        Alts:
        <div v-for="alt in player.alts" :key="alt.id">
          [ {{ alt.id }} ] {{ alt.name }}
        </div>
     </div>
   </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps<{ message: any }>();

const player = computed(() => props.message.data.player);
const descLines = computed(() => {
  if (player.value.description) {
    return player.value.description.split('\n');
  }
  return [];
});
</script>

<style lang="scss" scoped>
.description {
  max-height: 300px;
  overflow-y: auto;

  .description-line {
    min-height: 10px;
  }
}
</style>