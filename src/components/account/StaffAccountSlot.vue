<template>
  <div class='staff-link my-4'>
    <div class="my-4 text-center">
      <a href='/' @click.prevent="onClick">Staff Page</a>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const onClick = () => {
  store.commit("ui/modal/close");
  router.push({ name: "staff_index" });
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.staff-link {
  border-top: 1px solid $color-text-half;
  border-bottom: 1px solid $color-text-half;
}
</style>