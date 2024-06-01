<template>
  <div>
    <h3 class="name">{{ resource.name.toUpperCase() }}</h3>
    <div>Attribute: {{ resource.arg1 }}</div>
    <div>Value: {{ resource.arg2 }}</div>
  </div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
}
button.add-button {
  margin-bottom: 20px;
}
</style>