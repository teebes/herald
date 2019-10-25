<template>
  <div>
    Available exits:
    <template v-if="Object.keys(message.data).length">
      <div v-for="(room_data, direction) in message.data" :key="direction">
        {{ direction }} - {{ room_data.name }}
        <span
          v-if="$store.state.game.player.is_immortal"
          class="color-text-50 ml-4"
        >[ {{ room_data.id }} ]</span>
      </div>
    </template>
    <div v-else>None.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DIRECTIONS } from "@/constants.ts";

@Component
export default class Exits extends Vue {
  @Prop() message!: any;

  mounted() {
    console.log();
    console.log("");
  }

  // get roomExits() {
  //   const exits = [];
  //   for (const direction in DIRECTIONS) {
  //     if (this.message[direction]) {
  //       exits.push(this.message[direction])
  //     }

  //   }
  // }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>