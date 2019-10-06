<template>
  <ElementList
    title="Zone Loaders"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>


<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { BUILDER_ZONE_PATH_LIST } from "@/router.ts";
import ElementList from "@/components/elementlist/ElementList.vue";
import ZoneLoaderDetails from "@/components/builder/ZoneLoaderDetails.vue";
import ZoneView from "@/components/builder/zone/ZoneView";
import { BUILDER_ZONE_LOADER_DETAILS } from "@/router.ts";
import { BUILDER_FORMS, FormElement } from "@/core/forms.ts";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends ZoneView {
  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/zones/${this.$route.params.zone_id}/loaders/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_ZONE_LOADER_DETAILS,
        params: {
          world_id: this.$store.state.builder.world.id,
          loader_id: element_id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "num_rules", label: "Rules" }
    ];
  }

  onClickAdd() {
    const new_loader = {
      name: "Unnamed Loader",
      respawn_wait: 300,
      description: "",
      zone: this.$store.state.builder.zone,
      loader_condition: ""
    };

    const schema = BUILDER_FORMS.LOADER_INFO;

    const modal = {
      title: "Add Loader",
      data: new_loader,
      schema: schema,
      action: "builder/zones/loader_create"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>