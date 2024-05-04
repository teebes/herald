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
   <div v-if="this.$store.state.auth.user.is_staff && player.email" class='color-text-50 mt-1 staff-info'>
     <div>
       Email: {{ player.email }}
       - <span v-if="player.is_confirmed">(confirmed)</span>
       <span v-else>(unconfirmed)</span>
      </div>
     <div>Player ID: {{ player.id }}</div>
     <div>User ID: {{ player.user_id }}</div>
     <div>Username: {{ player.username }}</div>
   </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Whois extends Vue {
  @Prop() message!: any;

  get player() {
    return this.message.data.player;
  }

  get descLines() {
    if (this.player.description) {
      return this.player.description.split('\n');
    }
    return [];
  }
}
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