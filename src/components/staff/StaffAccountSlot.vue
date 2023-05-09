<template>
  <div class='staff-link my-4'>
    <div class="my-4 text-center">
      <a href='/' @click.prevent="OnClick">Staff Page</a>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  async OnClick() {
    this.$store.commit("ui/modal_clear");
    this.$router.push({ name: "staff_index" });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.staff-link {
  border-top: 1px solid $color-text-half;
  border-bottom: 1px solid $color-text-half;
}
</style>