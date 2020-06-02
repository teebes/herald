<template>
  <div id="zone-config" class="builder-config">
    <h2>ZONE CONFIG</h2>

    <div class="config-panels">
      <div class="processions">
        <h3>PROCESSIONS</h3>

        <div>Define processions, or death rooms that characters of certain factions can be taken to on death.</div>

        <router-link :to="processions_list_link">manage</router-link>
      </div>

      <div class="move">
        <h3>MOVE ZONE</h3>

        <div>This action moves all rooms in a zone at once, given a certain direction and distance.</div>

        <button class="btn-small mt-2" @click="moveZone">MOVE</button>

        <div></div>
      </div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import { BUILDER_ZONE_PROCESSION_LIST } from "@/router";
import { FormElement, DIRECTION } from "@/core/forms";

@Component
export default class ZoneConfig extends Mixins(ZoneView) {
  get processions_list_link() {
    return {
      name: BUILDER_ZONE_PROCESSION_LIST,
      params: { zone_id: this.$route.params.zone_id }
    };
  }

  async moveZone() {
    const schema: FormElement[] = [
      DIRECTION,
      {
        attr: "distance",
        label: "Distance"
      }
    ];
    const modal = {
      title: `Move Zone`,
      data: {
        direction: "north",
        distance: 0
      },
      schema: schema,
      action: "builder/zones/move_zone"
    };
    this.$store.commit("ui/modal_set", modal);
  }
}
</script>

