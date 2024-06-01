<template>
  <div v-if="message.data.quest">
    Pay attention...
    <span
      v-if="message.data.quest.suggested_level > 1"
      class="color-text-50 ml-4"
      >[ Suggested level: {{ message.data.quest.suggested_level }} ]</span
    >
  </div>
  <div v-else>{{ message.text }}</div>
</template>

<script lang="ts" setup>
defineProps<{message: any}>();
</script>
