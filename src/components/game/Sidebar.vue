<template>
  <div id="sidebar">
    <!-- Who list -->
    <div class="sidebar-element who-list">
      <div v-if="who_list && who_list['players']" @click="onClickWho">
        <span v-if="expanded === 'who'">-</span>
        <span v-else>+</span>
        {{ who_list["players"].length }}
        <template v-if="who_list['players'].length == 1">player</template>
        <template v-else>players</template>
        in world
      </div>
      <div v-if="expanded === 'who'" class="who-list-detail">
        <div v-for="player in who_list.players" :key="player.key">
          {{ player.name }} ({{ player.level }})
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Sidebar extends Vue {
  expanded: string = "";

  get who_list() {
    return this.$store.state.game.who_list;
  }

  onClickWho() {
    if (this.expanded === "who") {
      this.expanded = "";
    } else {
      this.expanded = "who";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#sidebar {
  background: $color-background-light;
  border-left: 2px solid $color-background-very-light;
  width: 250px;

  .sidebar-element {
    padding: 15px;
    &:not(:last-child) {
      margin-bottom: 1px solid $color-background-very-light;
    }
  }

  .who-list {
    &:hover {
      cursor: pointer;
    }
    span {
      width: 10px;
      display: inline-block;
    }
  }
  .who-list-detail {
    padding-left: 20px;
  }
}
</style>
