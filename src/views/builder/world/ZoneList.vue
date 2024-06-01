<template>
  <ElementList
    title="Zones"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd" />
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";


const store = useStore();
const route = useRoute();

const endpoint = computed(() => `/builder/worlds/${route.params.world_id}/zones/`);
const resolve_route = element => {
  return {
    name: 'builder_zone_index',
    params: {
      world_id: store.state.builder.world.id,
      zone_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "num_rooms", label: "Rooms" }
];

const onClickAdd = () => {
  const new_zone = {
    name: "Unnamed Zone"
  };

  store.commit('ui/modal/open_form', {
    title: `Add Zone`,
    data: new_zone,
    schema: BUILDER_FORMS.ZONE_INFO,
    action: 'builder/zone_create',
  });
};
</script>