<template>
  <div>{{ error_text }}</div>
</template>

<script lang='ts'>
/* 
  Component to display more information about an item or mob that is being
  hovered over (desktop) or clicked on (mobile). 
*/

import { Component, Prop, Vue, Watch } from "vue-property-decorator";

export default class GameLookupNotFound extends Vue {
  get lookup() {
    return this.$store.state.game.lookup;
  }

  get error_text() {
    if (this.lookup && this.lookup.key.split(".")[0] === "item")
      return "Item is no longer accessible.";
    else if (
      (this.lookup && this.lookup.key.split(".")[0] === "mob") ||
      this.lookup.key.split(".")[0] === "player"
    )
      return "This character is no longer in your room";
    return "This is no longer accessible.";
  }
}
</script>