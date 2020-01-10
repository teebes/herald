<template>
  <div id="com_log">
    <h1>Communication Log</h1>
    <div v-for="(entry, index) in log_entries" :key="index">
      {{ entry.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class CommunicationLog extends Vue {
  get log_entries() {
    return this.$store.state.game.com_list.slice().reverse();
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

#com_log {
  min-height: 200px;
}
</style>
