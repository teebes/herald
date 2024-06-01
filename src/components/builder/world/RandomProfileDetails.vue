<template>
  <div>
    <h3 class="name">{{ resource.name.toUpperCase() }}</h3>
    <div class="level">Level {{ resource.level }}</div>
    <div>{{ resource.chance_imbued }}% imbued</div>
    <div>{{ resource.chance_enchanted }}% enchanted</div>
    <div>{{ resource.restriction }}</div>
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