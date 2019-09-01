<template>
  <ElementList
    title="Players"
    :schema="list_schema"
    :filters="list_filters"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_WORLD_PLAYER_DETAIL } from "@/router.ts";
import WorldView from "@/components/builder/WorldView.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class MobTemplateList extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/players/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_WORLD_PLAYER_DETAIL,
        params: {
          world_id: this.$route.params.world_id,
          player_id: element_id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "level", label: "Level", light: true }
    ];
  }

  get list_filters() {
    return [
      {
        label: "factions",
        attr: "core_faction",
        filter_options: [
          { key: "human", name: "Human" },
          { key: "orc", name: "Orc" },
          { key: "lifeless", name: "Lifeless" }
        ]
      },
      {
        label: "levels",
        attr: "level_range",
        filter_options: [
          { key: "15", name: "1-5" },
          { key: "610", name: "6-10" },
          { key: "1115", name: "11-15" },
          { key: "1620", name: "16-20" }
        ]
      },
      {
        attr: "sort_by",
        label: "sorting",
        filter_options: [
          { key: "-level", name: "Level 20-1" },
          { key: "level", name: "Level 1-20" },
          { key: "-created_ts", name: "Last Created" },
          { key: "created_ts", name: "First Created" },
          { key: "name", name: "A - Z" },
          { key: "-name", name: "Z - A" }
        ]
      }
    ];
  }
}
</script>
