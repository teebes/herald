<template>
  <div class="w-full">
    <EditableCollection
      title="World Faction"
      name="factions"
      :endpoint="endpoint"
      :display_component="display_component"
      :schema="schema"
      action_add="builder/worlds/faction_add"
      action_edit="builder/worlds/faction_edit"
      action_delete="builder/worlds/faction_delete"
      registration_name="factions"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import WorldView from "@/components/builder/world/WorldView.ts";
import FactionDetail from "@/components/builder/world/FactionDetail.vue";
import EditableCollection from "@/components/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/factions/?page_size=50`;
  }

  get display_component() {
    return FactionDetail;
  }

  get schema() {
    const code: FormElement = {
      attr: "code",
      label: "Code"
    };

    const name: FormElement = {
      attr: "name",
      label: "Name"
    };

    const is_core: FormElement = {
      attr: "is_core",
      label: "Is Core",
      widget: "checkbox",
      default: true
    };

    const starting_room: FormElement = {
      attr: "starting_room",
      label: "Starting Room",
      widget: "reference",
      references: "room"
    };

    const is_default: FormElement = {
      attr: "is_default",
      label: "Is Default",
      widget: "checkbox",
      default: false,
      help: `Only applicable for core factions. If this is checked and "Can Select Core Faction" is checked in the world's advanced configuration, this faction will be the default selectable faction.`
    };

    const is_selectable: FormElement = {
      attr: "is_selectable",
      label: "Is Selectable",
      widget: "checkbox",
      default: true,
      help: `Only applicable for core factions. Whether the faction can be selected at character creation screen. Will only be applicable if "Can Select Core Faction" is checked in the world's advanced configuration.`
    };

    const death_room: FormElement = {
      attr: "death_room",
      label: "Death Room",
      widget: "reference",
      references: "room"
    };

    return [
      code,
      name,
      is_core,
      starting_room,
      //death_room,
      is_default,
      is_selectable
    ];
  }
}
</script>