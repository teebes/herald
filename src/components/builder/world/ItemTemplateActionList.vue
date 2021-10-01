<template>
  <EditableCollection
    title="Item Action"
    name="item_actions"
    registration_name="item_actions"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
  >
    <div class="color-text-60">
      Item actions are custom commands defined per item, available to any room where the item lies.
    </div>
  </EditableCollection>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import ItemAction from "@/components/builder/world/ItemTemplateAction.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class RoomChecks extends Mixins(Vue) {
  get template_id() {
    return this.$store.state.builder.worlds.item_template.id;
  }

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/itemtemplates/${this.template_id}/actions/`;
  }

  get display_component() {
    return ItemAction;
  }

  get schema() {
    return BUILDER_FORMS.ROOM_ACTION;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>