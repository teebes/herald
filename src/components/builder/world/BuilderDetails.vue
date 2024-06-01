<template>
  <div>
    <h3 class="name">{{ resource.user.name.toUpperCase() }}</h3>
    <div v-if="resource.read_only" class="color-text-50">read only access</div>
  </div>
</template>

<script lang='ts'setup>
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
h3.name {
  color: $color-text;
}
</style>