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
        <span class="unselectable">{{ d.toUpperCase() }}</span>
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
        <span class="unselectable">{{ d.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from "vuex";

const store = useStore();

const nesw_directions = ["north", "east", "south", "west"];
const ud_directions = ["up", "down"];

const isClickable = (direction: string) => {
  const room = store.state.game.room;
  if (!room) {
    return false;
  }
  return Boolean(room[direction]);
};

const onClick = (direction: string) => {
  if (!store.state.game.room[direction]) {
    return;
  }
  store.dispatch("game/cmd", direction);
};
</script>

<style lang="scss" scoped>
.directions-pad {
  padding: 10px 0;
}
</style>
