<template>
  <EditableCollection
    title="Room Detail"
    registration_name="room_details"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <RoomDescription :room="room" v-if="room && room.description" />
  </EditableCollection>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import RoomDetailsDetails from "@/components/builder/room/RoomDetailsDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";
import RoomDescription from "@/components/builder/room/RoomDescription.vue";

const store = useStore();
const route = useRoute();

const room = computed(() => store.state.builder.room);
const endpoint = `/builder/worlds/${route.params.world_id}/rooms/${route.params.room_id}/details/`;
const display_component = RoomDetailsDetails;
const schema: FormElement[] = [
  {
    attr: "keywords",
    label: "Keyword",
    required: true
  },
  {
    attr: "description",
    label: "Description",
    required: true
  },
  {
    attr: "is_hidden",
    label: "Is Hidden",
    widget: "checkbox",
    default: false
  }
];
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.description-content {
  margin-top: 20px;
}
</style>