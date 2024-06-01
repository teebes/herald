<template>
  <div class="test">
    <button @click="onClick">Click me</button>
  </div>
</template>

<script type='ts' setup>
import { useStore } from 'vuex';

const store = useStore();

function onClick() {
  store.commit('ui/notification_set', 'Hello world');
}
</script>

<style lang="scss">
.test {
  // margin-top: 200px;
}
</style>