<template>
  <div class="intro-prologue" @click="onClick" ref="introRef">
    <div
      class="prologue-text"
    >You are caught upside-down in a sticky web of silk three feet off the ground. After looking around trying to think of a way out of this predicament, you notice that your trusty boot knife has fallen to the ground. If you stretch your arm far enough, you might be able to pick it up and free yourself.</div>

    <div class="click-anywhere">
      <span v-if="player_id">CLICK ANYWHERE TO BEGIN</span>
      <span v-else>LOADING...</span>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useStore } from "vuex";
import { onOutsideClick } from "@/composables/onOutsideClick";

const store = useStore();

const player_id = computed(() => store.state.game.player_id);

const introRef = onOutsideClick(() => {
  if (player_id.value) {
    store.commit('ui/modal/close');
  }
});

const onClick = () => {
  if (player_id.value) {
    store.commit('ui/modal/close');
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.intro-prologue {
  padding: 15px;
  .prologue-text {
    @include font-text-regular;
    max-width: 400px;
    margin: 0 auto;
  }

  .click-anywhere {
    @include font-title-light;
    margin-top: 50px;
    text-align: center;
  }
}
</style>