<template>Redirecting...</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();

onMounted(() => {
  const pathMatch = route.params.pathMatch || [];
  const pathArray = Array.isArray(pathMatch) ? pathMatch : [pathMatch]; // Ensure it's an array
  const path = pathArray.join("/");
  window.location.href = "https://wot.writtenrealms.com/" + path;
});
</script>
