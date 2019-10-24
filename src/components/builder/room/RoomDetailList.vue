<template>
  <EditableCollection
    title="Room Detail"
    name="room_details"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <RoomDescription :room="room" v-if="room.description" />
  </EditableCollection>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";
import RoomDetailDetail from "@/components/builder/room/RoomDetailDetail.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";
import RoomDescription from "@/components/builder/room/RoomDescription.vue";

@Component({
  components: {
    EditableCollection,
    RoomDescription
  }
})
export default class RoomChecks extends Mixins(RoomView) {
  get room() {
    return this.$store.state.builder.room;
  }

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/rooms/${this.$route.params.room_id}/details/`;
  }

  get display_component() {
    return RoomDetailDetail;
  }

  get schema() {
    const keywords: FormElement = {
      attr: "keywords",
      label: "Keyword",
      required: true
    };
    const description: FormElement = {
      attr: "description",
      label: "Description",
      required: true
    };
    const is_hidden: FormElement = {
      attr: "is_hidden",
      label: "Is Hidden",
      widget: "checkbox",
      default: false
    };
    return [keywords, description, is_hidden];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.description-content {
  margin-top: 20px;
}
</style>