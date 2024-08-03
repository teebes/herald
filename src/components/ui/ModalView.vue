<template>
  <div class="modal-view">
    <div class="close-button hover" aria-label="Close" @click="closeModal">
      <span aria-hidden="true">&#10006;</span>
    </div>

    <div :class="{'my-4': !nomargin}">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from "vuex";

const store = useStore();
defineProps<{
  nomargin?: boolean;
}>();

const closeModal = () => {
  store.commit("ui/modal/close");
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.modal-view {
  padding: 15px;
  position: relative;

  .close-button {
    position: absolute;
    right: 0;
    top: -10px;
    padding: 20px;
  }
}
</style>