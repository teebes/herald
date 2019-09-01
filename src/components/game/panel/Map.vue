<template>
  <div class="map-wrapper mx-0">
    <Map
      v-if="this.$store.state.game.map"
      :unit="8"
      :radius="radius"
      :map="this.$store.state.game.map"
      :center_key="this.$store.state.game.room_key"
      @clickRoom="onRoomClick"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Map from "@/components/Map.vue";

@Component({
  components: {
    Map
  }
})
export default class GameMap extends Vue {
  @Prop() radius!: number;
  @Prop() width!: number;

  onRoomClick(room) {
    const current_x = this.$store.state.game.room.x,
      current_y = this.$store.state.game.room.y;

    for (const direction of ["north", "east", "south", "west"]) {
      if (direction === "north") {
        if (room.x === current_x && room.y === current_y + 1) {
          this.$store.dispatch("game/cmd", "north");
          return;
        } else if (room.x === current_x && room.y === current_y - 1) {
          this.$store.dispatch("game/cmd", "south");
          return;
        } else if (room.y === current_y && room.x === current_x + 1) {
          this.$store.dispatch("game/cmd", "east");
          return;
        } else if (room.y === current_y && room.x === current_x - 1) {
          this.$store.dispatch("game/cmd", "west");
          return;
        }
      }
    }
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

.map-wrapper {
  // margin: 0 auto;
  > .map-view {
    > #map {
      background: $color-background;
      margin: 0 auto;
      display: block;
      border: 0;
    }
  }
}
</style>