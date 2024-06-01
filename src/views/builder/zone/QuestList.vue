<template>
  <ElementList
    title="Quests"
    :schema="list_schema"
    :filters="list_filters"
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

const endpoint = `/builder/worlds/${route.params.world_id}/zones/${route.params.zone_id}/quests/`;

const resolve_route = (element) => {
  return {
    name: 'builder_zone_quest_details',
    params: {
      world_id: store.state.builder.world.id,
      quest_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "level", label: "Level", light: true }
];

const list_filters = [];

function onClickAdd() {
  const new_quest = {
    name: "Unnamed Quest",
    level: 1,
    zone: store.state.builder.zone,
    mob_template: null
  };

  const schema = [
    { attr: "name", label: "Name" },
    { attr: "level", label: "Suggested Level" },
    BUILDER_FORMS.MOB_TEMPLATE,
    BUILDER_FORMS.ZONE
  ];

  const modal = {
    title: `Add Quest`,
    data: new_quest,
    schema: schema,
    action: "builder/zones/quest_create"
  };
  store.commit('ui/modal/open_form', modal);
};
</script>