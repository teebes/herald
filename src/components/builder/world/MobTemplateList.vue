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
import WorldView from "@/components/builder/world/WorldView.ts";
import { BUILDER_FORMS, GET_MOB_TEMPLATE_INFO } from "@/core/forms.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";
import axios from "axios";

@Component({
  components: {
    ElementList
  }
})
export default class MobTemplateList extends Vue {
  world_factions: {}[] = [];

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/mobtemplates/`;
  }

  async mounted() {
    const resp = await axios.get(
      `/builder/worlds/${this.$route.params.world_id}/factions/`
    );
    const world_factions: {}[] = [];
    for (const faction of resp.data.results) {
      world_factions.push({
        key: faction.code,
        name: faction.name
      });
    }
    this.world_factions = world_factions;
  }

  get resolve_route() {
    return element => {
      return {
        name: BUILDER_MOB_TEMPLATE_DETAILS,
        params: {
          world_id: this.$store.state.builder.world.id,
          mob_template_id: element.id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name", nowrap: true },
      { name: "level", label: "Level", light: true },
      { name: "notes", label: "Notes", light: true }
    ];
  }

  get list_filters() {
    const mob_types = {
      label: "types",
      attr: "type",
      filter_options: [
        { key: "humanoid", name: "humanoid" },
        { key: "aberration", name: "aberration" },
        { key: "beast", name: "beast" },
        { key: "celestial", name: "celestial" },
        { key: "construct", name: "construct" },
        { key: "dragon", name: "dragon" },
        { key: "elemental", name: "elemental" },
        { key: "fey", name: "fey" },
        { key: "fiend", name: "fiend" },
        { key: "giant", name: "giant" },
        { key: "monstrosity", name: "monstrosity" },
        { key: "ooze", name: "ooze" },
        { key: "plant", name: "plant" },
        { key: "undead", name: "undead" }
      ]
    };

    const factions = {
      label: "factions",
      attr: "faction",
      filter_options: this.world_factions
    };

    return [
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
        filter_options: [
          { key: "-created_ts", name: "Last Created" },
          { key: "-level", name: "Level - desc" },
          { key: "level", name: "Level - asc" },
        ]
      },
      factions,
      mob_types
    ];
  }

  async onClickAdd() {
    //console.log(this.$store.state.builder.world.is_classless);
    const default_archetype = this.$store.state.builder.world.is_classless ? "" : "warrior";
    const new_mob_template = {
      name: "an unnamed mob",
      level: 1,
      description: "",
      notes: "",
      room_description: "",
      keywords: "",
      type: "humanoid",
      archetype: default_archetype,
      hit_msg_first: "hit",
      hit_msg_third: "hits",
      aggression: "normal",
      gender: "female",
      is_invisible: false,
      core_faction: this.$store.getters["builder/defaultCoreFaction"],
      fights_back: true
    };
    const schema = GET_MOB_TEMPLATE_INFO();

    const modal = {
      title: `Add Mob Template`,
      data: new_mob_template,
      schema: schema,
      action: "builder/worlds/mob_template_create"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>
