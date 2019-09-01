<template>
  <div class="cast-message">
    <ProgressBar
      :label="message.data.skill"
      :duration="message.data.duration"
      :method="message.data.method"
      :expires="message.data.expires"
    />
    <!-- <div class="progress-bar">
      <div class="progress-fill"></div>
      <div class="progress-label">{{ message.data.skill }}</div>
    </div>-->
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ProgressBar from "@/components/game/ProgressBar.vue";

@Component({ components: { ProgressBar } })
export default class extends Vue {
  @Prop() message!: any;
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
.cast-message {
  display: flex;
  .progress-bar {
    .progress-label {
      padding: 0 20px !important;
    }
  }
}
</style>