<template>
  <ElementList
    title="Currently Playing"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import { BUILDER_WORLD_PLAYER_DETAIL } from "@/router";

@Component({
  components: {
    ElementList
  }
})
export default class StaffPlaying extends Vue {
  get endpoint() {
    return `/staff/playing/`;
  }

  get resolve_route() {
    return player => {
      return {
        name: BUILDER_WORLD_PLAYER_DETAIL,
        params: {
          world_id: player.root_world_id,
          player_id: player.id
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
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>