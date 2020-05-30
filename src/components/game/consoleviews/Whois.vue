<template>
  <div class='indented'>
   <div>{{ player.name }} {{ player.title }}</div> 
   <div>
     Level {{ player.level }} 
     <template v-if="player.gender == 'non_binary'">non-binary</template> 
     <template v-else>{{ player.gender }}</template>
     {{ player.core_faction }} {{ player.archetype }}</div>
   <div v-for="faction_data in player.factions" :key="faction_data.id" class='color-text-60'>
     {{ faction_data.name }} {{ faction_data.rank}}
   </div>
   <div v-if="this.$store.state.auth.user.is_staff" class='color-text-50'>
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
}
</script>