<template>
  <div class="factions indented">
    <div class="core-faction">Core Faction: {{ message.data.core_faction }}</div>

    <div class="clanned-factions faction-group mt-4" v-if="has_clanned_factions">
      <div class="color-text-50 font-text-regular">Clanned Factions</div>
      <div
        v-for="(faction, index) in message.data.clanned_factions"
        :key="index"
      >Rank {{ faction.rank_number }} {{faction.name}} - {{faction.rank_name}} [{{faction.standing}}]</div>
    </div>

    <div class="friendly-factions faction-group mt-4" v-if="has_friendly_factions">
      <div class="color-text-50 font-text-regular">Friendly Factions</div>
      <div
        v-for="(faction, index) in message.data.friendly_factions"
        :key="index"
      >{{faction.name}} [{{faction.standing}}]</div>
    </div>

    <div class="hostile_factions faction-group mt-4" v-if="has_hostile_factions">
      <div class="color-text-50 font-text-regular">Hostile Factions</div>
      <div
        v-for="(faction, index) in message.data.hostile_factions"
        :key="index"
      >{{faction.name}} [{{faction.standing}}]</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameFactions extends Vue {
  @Prop() message!: any;

  get has_friendly_factions() {
    return Boolean(Object.keys(this.message.data.friendly_factions).length);
  }

  get has_hostile_factions() {
    return Boolean(Object.keys(this.message.data.hostile_factions).length);
  }

  get has_clanned_factions() {
    return Boolean(Object.keys(this.message.data.clanned_factions).length);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>

