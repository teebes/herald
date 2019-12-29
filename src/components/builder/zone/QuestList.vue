<template>
  <ElementList
    title="Quests"
    :schema="list_schema"
    :filters="list_filters"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import ZoneView from "@/components/builder/zone/ZoneView";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { BUILDER_ZONE_QUEST_DETAIL } from "@/router.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends Mixins(ZoneView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/zones/${this.$route.params.zone_id}/quests/`;
  }

  get resolve_route() {
    return element => {
      return {
        name: BUILDER_ZONE_QUEST_DETAIL,
        params: {
          world_id: this.$store.state.builder.world.id,
          quest_id: element.id
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
    return [];
  }

  onClickAdd() {
    const new_quest = {
      name: "Unnamed Quest",
      level: 1,
      zone: this.$store.state.builder.zone,
      mob_template: null
    };

    const schema = [
      {
        attr: "name",
        label: "Name"
      },
      {
        attr: "level",
        label: "Suggested Level"
      },
      BUILDER_FORMS.MOB_TEMPLATE,
      BUILDER_FORMS.ZONE
    ];

    const modal = {
      title: `Add Quest`,
      data: new_quest,
      schema: schema,
      action: "builder/zones/quest_create"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>