<template>
  <div>
    <h3 class="name">
      {{ resource.num}}x {{ resource.itemtemplate.name.toUpperCase() }}
    </h3>

    <div v-if="resource.archetype">{{ capfirst(resource.archetype) }}s only.</div>
  </div>
</template>

<script lang='ts' setup>
import { capfirst } from "@/core/utils.ts"
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
}
</style>