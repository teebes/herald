<template>
  <ElementList
    title="Zone Paths"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>


<script lang='ts' setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();
const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/zones/${route.params.zone_id}/paths/`;
const resolve_route = (element: any) => {
  return {
    name: 'builder_zone_path_details',
    params: {
      world_id: store.state.builder.world.id,
      path_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" }
];

const onClickAdd = () => {
  const new_path = {
    name: "Unnamed Path"
  };
  const modal = {
    title: "New Path",
    data: new_path,
    schema: BUILDER_FORMS.ZONE_PATH_DETAILS,
    action: "builder/path_create"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>