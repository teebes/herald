<template>
  <div class="indented">
    <h3 class="my-2">{{ message.data.players.length }} PLAYERS IN WORLD</h3>
    <div
      v-for="player in message.data.players"
      :key="player.id"
      :class="playerClasses(player)"
    >
      <!-- <span v-if="player.is_immortal">~</span> -->
      {{ player.name }} {{ player.title }} ({{ player.level }})
      <span v-if="player.clan" class="ml-2">[ {{ player.clan.name }} ]</span>
      <span v-if="player.is_invisible" class="ml-1 color-text-50"
        >[invisible]</span
      >
      <span v-if="user.is_staff && player.core_faction" class="ml-2 color-text-50">[ {{ player.core_faction }} ]</span>
      <span v-if="player.link_id" class="ml-2 color-text-50">[ link {{ player.link_id }} ]</span>
      <span v-if="player.room_id" class="ml-2 color-text-50">[ {{ player.room_id}} ]</span>
      <span v-if="player.is_idle" class="ml-2 color-text-50">(Idle)</span>
    </div>

    <!-- <template v-if="grapevine_worlds.length">
      <h3 class="mt-2">GRAPEVINE</h3>
      <div v-for="world_data of grapevine_worlds" :key="world_data.name">
        <div class="gworld-name-and-count" @click="clickWorld(world_data.name)">
          <span v-if="expanded_worlds[world_data.name]">-</span>
          <span v-else>+</span>
          {{ world_data.name }} ({{ world_data.players.length }} players)
        </div>
        <template v-if="expanded_worlds[world_data.name]">
          <div
            class="gworld-players ml-4"
            v-for="player in world_data.players"
            :key="player"
          >
            {{ player }}@{{ world_data.name }}
          </div>
        </template>
      </div>
    </template> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameWho extends Vue {
  @Prop() message!: any;
  @Prop() distanceToBottom!: number;

  expanded_worlds: {} = {};

  get grapevine_worlds() {
    const worlds: {}[] = [],
      world_names = Object.keys(this.message.data.grapevine).sort();

    for (const world_name of world_names) {
      const players = this.message.data.grapevine[world_name];
      if (players && players.length) {
        worlds.push({
          players: players,
          name: world_name
        });
      }
    }
    return worlds;
  }

  get user() {
    return this.$store.state.auth.user;
  }

  clickWorld(world_name) {
    if (!this.expanded_worlds[world_name]) {
      Vue.set(this.expanded_worlds, world_name, true);
    } else {
      Vue.set(this.expanded_worlds, world_name, false);
    }
    if (this.distanceToBottom < 5) {
      this.$emit("scrollDown");
    }
  }

  playerClasses(player) {
    if (player.is_immortal)
      return {"color-primary": true}
    else if (player.name_recognition)
      return {"color-secondary": true}
    else
      return {}
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.gworld-name-and-count {
  &:hover {
    cursor: pointer;
  }
}
</style>
