<template>
  <ElementList
    title="Zone Rooms"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";
import ElementList from "@/components/elementlist/ElementList.vue";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/zones/${route.params.zone_id}/rooms/`;
const resolve_route = element => {
  return {
    name: "builder_room_index",
    params: {
      world_id: route.params.world_id,
      room_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" }
];
</script>