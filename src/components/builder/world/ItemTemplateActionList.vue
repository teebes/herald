<template>
  <EditableCollection
    title="Item Action"
    name="item_actions"
    registration_name="item_actions"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    :show_add="true"
  >
    <div class="color-text-60">
      Item actions are custom commands defined per item, available to any room where the item lies.
    </div>
  </EditableCollection>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ItemAction from "@/components/builder/world/ItemTemplateAction.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";

const store = useStore();
const route = useRoute();

const template_id = computed(() => store.state.builder.worlds.item_template.id);

const endpoint = `/builder/worlds/${route.params.world_id}/itemtemplates/${template_id.value}/actions/`;

const display_component = ItemAction;
const schema = BUILDER_FORMS.ROOM_ACTION;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>