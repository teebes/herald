<template>
  <div>
    <h3 class="name">{{ builder.user.name.toUpperCase() }}</h3>
    <div class="color-text-50">Builder rank {{ builder.builder_rank }}</div>

    <div v-if="builder.builder_rank === 1 || builder.builder_rank === 2" class="mt-4">
      <router-link :to="builder_assignments_link">Manage builder Assignments</router-link>
    </div>
  </div>
</template>

<script lang='ts'setup>
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps<{
  resource: any;
}>();

const builder = props.resource;

const builder_assignments_link = {
  name: 'builder_world_builder_assignment_list',
  params: {
    world_id: route.params.world_id,
    builder_id: builder.id
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
h3.name {
  color: $color-text;
}
</style>