<template>
  <ElementList
    title="Zone Paths"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    @add="onClickAdd"
  />
</template>


<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_ZONE_PATH_LIST } from "@/router.ts";
import ElementList from "@/components/elementlist/ElementList.vue";
import ZoneView from "@/components/builder/ZoneView";
import { BUILDER_ZONE_PATH_DETAILS } from "@/router.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { 
  BUILDER_ACTIONS, 
  UI_MUTATIONS,
} from "@/constants";

@Component({
  components: {
    ElementList
  }
})
export default class extends Mixins(ZoneView) {

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/zones/${
      this.$route.params.zone_id
    }/paths/`;
  }

  get resolve_route() {
    return element_id => {
      return {
        name: BUILDER_ZONE_PATH_DETAILS,
        params: {
          world_id: this.$store.state.builder.world.id,
          path_id: element_id
        }
      };
    };
  }

  get list_schema() {
    return [{ name: "id", label: "ID" }, { name: "name", label: "Name" }];
  }

  onClickAdd() {
    const new_path = {
      name: "Unnamed Path"
    }
    const modal = {
      title: 'New Path',
      data: new_path,
      schema: BUILDER_FORMS.ZONE_PATH_DETAILS,
      action: BUILDER_ACTIONS.PATH_CREATE,
    }
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>