<template>
  <div>
    <h3 class="name mb-2">{{ resource.name.toUpperCase() }}</h3>
    <div>Fact: {{ resource.fact }}</div>
    <div>Value: {{ resource.value }}</div>
    <div>Value Selection: {{ resource.selection }}</div>
    <div>Schedule: {{ resource.schedule }}</div>
    <div>Schedule Type: {{ resource.schedule_type }}</div>
  </div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>