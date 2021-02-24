<template>
  <EditableCollection
    title="Room Action"
    name="room_actions"
    registration_name="room_actions"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <div class="color-text-60">
      Room actions are custom commands defined per room. For more information, refer to the <a href="https://docs.writtenrealms.com/building/roomactions">documentation page</a>.
    </div>
  </EditableCollection>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";
import RoomAction from "@/components/builder/room/RoomAction.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class RoomChecks extends Mixins(RoomView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/rooms/${this.$route.params.room_id}/actions/`;
  }

  get display_component() {
    return RoomAction;
  }

  get schema() {
    return BUILDER_FORMS.ROOM_ACTION;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>