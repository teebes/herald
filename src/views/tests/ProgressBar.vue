<template>
  <div>Progress bar test</div>
  <div class="progress-bar-test">
    <ProgressBar label="Test" :duration="2" method="cast" />
  </div>
</template>

<script type='ts' setup>
import ProgressBar from "@/components/game/ProgressBar.vue";
</script>

<style lang="scss">
.progress-bar-test {
  width: 200px;
}
</style>