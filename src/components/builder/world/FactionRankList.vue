<template>
  <div class="w-full">
    <EditableCollection
      :title="faction_name + ' Faction Rank'"
      name="faction_ranks"
      :endpoint="endpoint"
      :display_component="display_component"
      :schema="schema"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import EditableCollection from "@/components/EditableCollection.vue";
import FactionRankDetail from "@/components/builder/world/FactionRankDetail.vue";
import { FormElement } from "@/core/forms.ts";

@Component({
  components: {
    EditableCollection
  }
})
export default class FactionRankList extends Vue {

  get faction_name() {
    const faction_id = Number(this.$route.params.faction_id);
    const factions = this.$store.state.builder.world_factions;
    function getFactionNameById(factionId: number): string | null {
      const faction = factions.find(f => f.id === factionId);
      return faction ? faction.name : '';
    }
    return getFactionNameById(faction_id);
  }

  get endpoint() {
    return `/builder/worlds/${this.$route.params.world_id}/factions/${this.$route.params.faction_id}/ranks/`;
  }

  get display_component() {
    return FactionRankDetail;
  }

  get schema() {
    const code: FormElement = {
      attr: "standing",
      label: "Standing"
    };
    const name: FormElement = {
      attr: "name",
      label: "Name"
    };

    return [code, name];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>