<template>
  <EditableCollection
    title="Room Detail"
    name="room_details"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";
import RoomDetailDetail from "@/components/builder/room/RoomDetailDetail.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class RoomChecks extends Mixins(RoomView) {
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
    return [keywords, description];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>