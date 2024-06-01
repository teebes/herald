<template>
  <div class="cast-message">
    <ProgressBar
      :label="message.data.skill"
      :duration="message.data.duration"
      :method="message.data.method"
      :expires="message.data.expires"
    />
  </div>
</template>

<script lang='ts' setup>
import ProgressBar from "@/components/game/ProgressBar.vue";

defineProps<{
  message: any;
}>();
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