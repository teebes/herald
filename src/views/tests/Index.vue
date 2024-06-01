<template>
  <div class="test">
    <button @click="onClick">Click me</button>
  </div>
</template>

<script type='ts' setup>
import { useStore } from 'vuex';
import Intro from '@/components/game/Intro.vue';

const store = useStore();

function onClick() {
  store.commit('ui/modal/open_view', {
    component: Intro,
    options: {
      overlayClasses: ['opaque'],
      closeOnOutsideClick: true,
    }
  });
}
</script>

<style lang="scss">
.test {
  // margin-top: 200px;
}
</style>