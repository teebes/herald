<template>
  <ElementList
    title="Worlds"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang='ts' setup>
import { useStore } from "vuex";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();

const endpoint = `/staff/worlds/`;

const resolve_route = (world: any) => {
  return {
    name: "builder_world_index",
    params: {
      world_id: world.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "num_zones", label: "Zones" },
  { name: "num_players", label: "Players" },
  { name: "num_mobs", label: "Mobs" },
  { name: "num_items", label: "Items" }
];

const onClickAdd = () => {
  const new_zone = {
    name: "Unnamed Zone"
  };
  const modal = {
    title: `Add Zone`,
    data: new_zone,
    schema: BUILDER_FORMS.ZONE_INFO,
    action: "builder/zone_create"
  };
  store.commit('ui/modal/open_form', modal);
};
</script>