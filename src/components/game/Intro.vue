<template>
  <div class="intro-prologue" @click="onClick">
    <div
      class="prologue-text"
    >You are caught upside-down in a sticky web of silk three feet off the ground. After looking around trying to think of a way out of this predicament, you notice that your trusty boot knife has fallen to the ground. If you stretch your arm far enough, you might be able to pick it up and free yourself.</div>

    <div class="click-anywhere">CLICK ANYWHERE TO BEGIN</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class extends Vue {
  @Prop() overlayClasses!: string[];

  onClick() {
    this.$store.commit(UI_MUTATIONS.MODAL_CLOSE);
  }
}
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