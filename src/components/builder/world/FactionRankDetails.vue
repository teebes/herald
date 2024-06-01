<template>
  <div>{{ resource.name }} - {{ resource.standing }}</div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>