<template>
  <div>
    <h3 class="name" v-if="resource.keywords">{{ resource.keywords.toUpperCase() }}</h3>
    <div>{{ resource.description }}</div>
    <div class="color-text-50" v-if="resource.is_hidden">This detail is hidden.</div>
  </div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped></style>