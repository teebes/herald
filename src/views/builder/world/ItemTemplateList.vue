<template>
  <div v-if="store.state.builder.world.instance_of.id">
    <h2 class="mb-4">ITEM TEMPLATES</h2>
    <p>The item templates of an instance are inherited from the parent world:</p>
    <p>
      <router-link
        :to="{name: 'builder_item_template_list', params: {world_id: store.state.builder.world.instance_of.id}}">
        {{ store.state.builder.world.instance_of.name }} Item Templates
      </router-link>
    </p>
  </div>

  <ElementList
    v-else
    title="Item Templates"
    :schema="list_schema"
    :filters="list_filters"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { onBeforeRouteUpdate } from "vue-router";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();

const endpoint = `/builder/worlds/${store.state.builder.world.id}/itemtemplates/`;

const resolve_route = element => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: store.state.builder.world.id,
      item_template_id: element.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "level", label: "Level", light: true }
];

const list_filters: any[] = [
  {
    label: "Type",
    attr: "item_type",
    filter_options: [
      { key: "weapon_1h", name: "1H weapons" },
      { key: "weapon_2h", name: "2H weapons" },
      { key: "shield", name: "Shields" },
      { key: "head", name: "Head" },
      { key: "body", name: "Body" },
      { key: "arms", name: "Arms" },
      { key: "hands", name: "Hands" },
      { key: "waist", name: "Waist" },
      { key: "legs", name: "Legs" },
      { key: "feet", name: "Feet" },
      { key: "accessory", name: "Accessory" },
      { key: "augment", name: "Augment" },
      { key: "inert", name: "Inert" },
      { key: "container", name: "Containers" },
      { key: "trash", name: "Trashes" },
      { key: "quest", name: "Quest" },
      { key: "food", name: "Food" },
      { key: "key", name: "Key" }
    ]
  }
];

const onClickAdd = () => {
  const new_item_template = {
    name: "a thing",
    level: 1,
    description: "",
    notes: "",
    ground_description: "",
    keywords: "",
    type: "inert",
    archetype: "warrior",
    cost: 0
  };

  const modal = {
    title: `Add Item Template`,
    data: new_item_template,
    schema: BUILDER_FORMS.ITEM_TEMPLATE_INFO,
    action: "builder/worlds/item_template_create"
  };
  store.commit("ui/modal/open_form", modal);
};

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.world_id !== from.params.world_id) {
    const world = await store.dispatch(
      'builder/fetch_world',
      to.params.world_id);
    store.commit('builder/room_set', world.last_viewed_room);
    store.commit('builder/zone_set', world.last_viewed_room.zone);
  }
  next();
});
</script>