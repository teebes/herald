<template>
  <div>
    <h3 class="currency">{{ resource.code.toUpperCase() }}</h3>

    <div class="mt-4">{{ resource.name }}</div>

  </div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>
