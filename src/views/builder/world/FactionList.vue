<template>
  <div v-if="store.state.builder.world.builder_info.builder_rank > 2">
    <div v-if="store.state.builder.world.instance_of.id">
      <h2 class="mb-4">WORLD FACTIONS</h2>
      <p>The factions of an instance are inherited from the parent world:</p>
      <p>
        <router-link
          :to="{name: 'builder_world_faction_list', params: {world_id: store.state.builder.world.instance_of.id}}">
          {{ store.state.builder.world.instance_of.name }} Item Templates
        </router-link>
      </p>
    </div>

    <div class="w-full" v-else>
      <EditableCollection
        title="World Faction"
        name="factions"
        :endpoint="endpoint"
        :display_component="display_component"
        :schema="schema"
        action_add="builder/worlds/faction_add"
        action_edit="builder/worlds/faction_edit"
        action_delete="builder/worlds/faction_delete"
        registration_name="factions"
        :page_size="50"
      />
    </div>
  </div>
  <div v-else>
    <div>
      You do not have permission to manage factions for this world.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import FactionDetails from "@/components/builder/world/FactionDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, DESCRIPTION } from "@/core/forms.ts";

const route = useRoute();
const store = useStore();


const endpoint = `/builder/worlds/${route.params.world_id}/factions/`;
const display_component = FactionDetails;
const schema: FormElement[] = [
  {
    attr: "code",
    label: "Code",
  },
  {
    attr: "name",
    label: "Name",
  },
  DESCRIPTION,
  {
    attr: "is_core",
    label: "Is Core",
    widget: "checkbox",
    default: true,
  },
  {
    attr: "starting_room",
    label: "Starting Room",
    widget: "reference",
    references: "room",
    help: `Only applicable for core factions.`
  },
  {
    attr: "is_default",
    label: "Is Default",
    widget: "checkbox",
    default: false,
    help: `Only applicable for core factions. If this is checked and "Can Select Core Faction" is checked in the world's advanced configuration, this faction will be the default selectable faction.`,
  },
  {
    attr: "is_selectable",
    label: "Is Selectable",
    widget: "checkbox",
    default: true,
    help: `Only applicable for core factions. Whether the faction can be selected at character creation screen. Will only be applicable if "Can Select Core Faction" is checked in the world's advanced configuration.`,
  },
];

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
