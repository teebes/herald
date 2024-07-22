<template>
  <div v-if="resource">
    <div class='flex justify-between'>
      <h3 class="name inline-block" v-if="resource.name">{{ resource.name.toUpperCase() }}</h3>
      <button class="btn-thin clone" @click="clone(resource)">CLONE</button>
    </div>

    <div>Action:</div>
    <div class="panel mt-1">{{ resource.actions }}</div>

    <div class='mt-4'>Commands: </div>
    <div class='panel mt-1'>
      <div v-for="(command, index) in commands" :key="index">{{ command }}</div>
    </div>

    <div class='mt-4' v-if="resource.conditions">
      Conditions: <div class="panel mt-1">{{ resource.conditions }}</div>
      <div v-if="resource.show_details_on_failure" class='mt-4'>

        <div v-if="resource.failure_message">
          Custom failure message will be shown if condition fails:
          <span>{{ resource.failure_message }}</span>
        </div>
        <div v-else>
          Default failure message will be shown if condition fails.
        </div>
      </div>
    </div>

    <div class="mt-2">

    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const props = defineProps<{
  resource: any;
}>();
const emit = defineEmits(['addToCollection']);

const commands = computed(() => props.resource.commands.split("\n"));

const clone = async (resource) => {
  if (!confirm(`Clone this room action?`)) return;
  const world_id = route.params.world_id;
  const room_id = route.params.room_id;
  const action_id = resource.id;
  const endpoint = `/builder/worlds/${world_id}/rooms/${room_id}/actions/${action_id}/clone/`;
  const resp = await axios.post(endpoint);
  emit('addToCollection', resp.data);
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
  align-content: space-between;
}
button.add-button {
  margin-bottom: 20px;
}
.resource-link > a {
  color: $color-secondary;
}
button.clone {
  margin-bottom: 1px;
}
</style>