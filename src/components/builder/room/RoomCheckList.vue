<template>
  <EditableCollection
    title="Room Check"
    name="room_checks"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <div class="color-text-60">
      Room Checks are a tool for restricting access to one or more rooms based on certain conditions. For more information, refer to the <a href="https://docs.writtenrealms.com/building/roomchecks">Room Checks documentation</a>.
    </div>
  </EditableCollection>


</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";
import RoomCheck from "@/components/builder/room/RoomCheck.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class RoomChecks extends Mixins(RoomView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/rooms/${this.$route.params.room_id}/checks/`;
  }

  get display_component() {
    return RoomCheck;
  }

  get schema() {
    return BUILDER_FORMS.ROOM_CHECK;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>