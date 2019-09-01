<template>
  <div class="directions-pad">
    <div class="nesw-block">
      <div
        v-for="d in nesw_directions"
        :key="nesw_directions.indexOf(d)"
        class="dir-button"
        :direction="d"
        :class="{ clickable: isClickable(d) }"
        @click="onClick(d)"
      >
        <span>{{ d.toUpperCase() }}</span>
      </div>
    </div>
    <div class="ud-block">
      <div
        v-for="d in ud_directions"
        :key="ud_directions.indexOf(d)"
        class="dir-button"
        :direction="d"
        :class="{ clickable: isClickable(d) }"
        @click="onClick(d)"
      >
        <span>{{ d.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    MobileExits
  }
})
export default class MobileExits extends Vue {
  nesw_directions: string[] = ["north", "east", "south", "west"];
  ud_directions: string[] = ["up", "down"];

  isClickable(direction) {
    const room = this.$store.state.game.room;
    if (!room) {
      return false;
    }
    return Boolean(room[direction]);
  }

  onClick(direction) {
    if (!this.$store.state.game.room[direction]) {
      return;
    }
    this.$store.dispatch("game/cmd", direction);
  }
}
</script>

<style lang="scss" scoped>
.directions-pad {
  padding: 10px 0;
}
</style>

