<template>
  <div v-if="store.state.builder.world.builder_info.builder_rank > 2">
    <EditableCollection
      title="World Builder"
      registration_name="builders"
      :endpoint="endpoint"
      :display_component="display_component"
      :schema="schema"
    >
      <slot>
        <div
          class="color-text-50"
        >To add a builder, click 'ADD WORLD BUILDER' and look them up by e-mail address.</div>
      </slot>
    </EditableCollection>
  </div>
  <div v-else>
    <div>
      You do not have permission to manage builders for this world.
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import BuilderDetails from "@/components/builder/world/BuilderDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";

const store = useStore();
const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/builders/`;
const display_component = BuilderDetails;

const schema: FormElement[] = [
  {
    attr: "user",
    label: "User",
    widget: "reference",
    references: "user",
    context: "add_builder",
    create_only: true
  },
  // {
  //   attr: "read_only",
  //   label: "Read Only Access",
  //   widget: "checkbox",
  //   default: true
  // }
  {
    attr: "builder_rank",
    label: "Builder Rank",
    default: "1",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" }
    ],
    help: `Higher ranks have more permissions.<br/>
      1: Can only see and edit entities that they have been assigned.<br/>
      2: Can see all entities but can only edit those they have been assigned.<br/>
      3: Can see and edit all entities and set builder ranks up to 3.<br/>
      4: Max rank, can do anything the author can. Functionally equivalent to the author.`
  },
];
</script>
