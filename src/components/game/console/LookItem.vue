<template>
  <div class="look-item indented">
    <ItemInfo :item="message.data.target" />
  </div>
</template>

<script lang='ts' setup>
import ItemInfo from "../ItemInfo.vue";
defineProps<{
  message: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>