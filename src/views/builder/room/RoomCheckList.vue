<template>
  <EditableCollection
    title="Room Check"
    registration_name="room_checks"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <div class="color-text-60">
      Room Checks are a tool for restricting access to one or more rooms based on certain conditions. For more information, refer to the <a href="https://docs.writtenrealms.com/building/roomchecks">Room Checks documentation</a>.
    </div>
  </EditableCollection>
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";
import RoomCheckDetails from "@/components/builder/room/RoomCheckDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";

const route = useRoute();
const endpoint = `/builder/worlds/${route.params.world_id}/rooms/${route.params.room_id}/checks/`;
const display_component = RoomCheckDetails;
const schema = BUILDER_FORMS.ROOM_CHECK;
</script>
