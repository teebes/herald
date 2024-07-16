<template>
  <ElementList
    title="Currently Playing"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang="ts" setup>
import ElementList from "@/components/elementlist/ElementList.vue";

const endpoint = `/staff/playing/`;
const resolve_route = (player: any) => {
  return {
    name: "builder_world_player_details",
    params: {
      world_id: player.root_world_id,
      player_id: player.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "level", label: "Level", light: true },
  { name: "world_name", label: "World", light: true },
  { name: "user.email", label: "Email", light: true }
];
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
