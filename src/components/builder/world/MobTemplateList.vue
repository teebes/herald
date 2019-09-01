<template>
  <ElementList
    title="Mob Templates"
    :schema="list_schema"
    :filters="list_filters"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_MOB_TEMPLATE_DETAILS } from "@/router.ts";
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
    return `/builder/worlds/${this.$route.params.world_id}/mobtemplates/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_MOB_TEMPLATE_DETAILS,
        params: {
          world_id: this.$store.state.builder.world.id,
          mob_template_id: element_id
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
        label: "types",
        attr: "type",
        filter_options: [
          { key: "humanoid", name: "Humanoid" },
          { key: "beast", name: "Beast" },
          { key: "plant", name: "Plant" }
        ]
      },
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
        label: "special",
        attr: "special",
        filter_options: [
          { key: "is_merchant", name: "Is Merchant" },
          { key: "has_quest", name: "Has Quest" },
          { key: "is_elite", name: "Is Elite" }
        ]
      },
      {
        attr: "sort_by",
        label: "sorting",
        filter_options: [{ key: "-created_ts", name: "Last Created" }]
      }
    ];
  }

  async onClickAdd() {
    const new_mob_template = {
      name: "an unnamed mob",
      level: 1,
      description: "",
      notes: "",
      room_description: "",
      keywords: "",
      type: "humanoid",
      archetype: "warrior",
      hit_msg_first: "hit",
      hit_msg_third: "hits",
      aggression: "normal",
      gender: "female"
    };

    const modal = {
      title: `Add Mob Template`,
      data: new_mob_template,
      schema: BUILDER_FORMS.MOB_TEMPLATE_INFO,
      action: "builder/worlds/mob_template_create"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>
