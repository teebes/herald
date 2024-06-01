<template>
  <div>{{ error_text }}</div>
</template>

<script lang='ts' setup>
/*
  Component to display more information about an item or mob that is being
  hovered over (desktop) or clicked on (mobile).
*/
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

const lookup = computed(() => store.state.game.lookup);

const error_text = computed(() => {
  if (lookup.value && lookup.value.key.split(".")[0] === "item")
    return "Item is no longer accessible.";
  else if (
    (lookup.value && lookup.value.key.split(".")[0] === "mob") ||
    lookup.value.key.split(".")[0] === "player"
  )
    return "This character is no longer in your room";
  return "This is no longer accessible.";
});
</script>