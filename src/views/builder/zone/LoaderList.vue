<template>
  <ElementList
    title="Zone Loaders"
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

const endpoint = `/builder/worlds/${route.params.world_id}/zones/${route.params.zone_id}/loaders/`;

const resolve_route = element => {
  return {
    name: "builder_zone_loader_details",
    params: {
      world_id: route.params.world_id,
      loader_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "num_rules", label: "Rules" }
];

const onClickAdd = () => {
  const new_loader = {
    name: "Unnamed Loader",
    respawn_wait: 300,
    description: "",
    zone: store.state.builder.zone,
    loader_condition: ""
  };

  const schema = BUILDER_FORMS.LOADER_INFO;

  const modal = {
    title: "Add Loader",
    data: new_loader,
    schema: schema,
    action: "builder/zones/loader_create"
  };
  store.commit('ui/modal/open_form', modal);
};
</script>