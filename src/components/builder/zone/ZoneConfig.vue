<template>
  <div id="zone-config" class="builder-config">
    <h2>ZONE CONFIG</h2>

    <div class="config-panels">
      <div class="processions">
        <h3>PROCESSIONS</h3>

        <div>Define processions, or death rooms that characters of certain factions can be taken to on death.</div>

        <router-link :to="processions_list_link">manage</router-link>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import { BUILDER_ZONE_PROCESSION_LIST } from "@/router";

@Component
export default class ZoneConfig extends Mixins(ZoneView) {
  get processions_list_link() {
    return {
      name: BUILDER_ZONE_PROCESSION_LIST,
      params: { zone_id: this.$route.params.zone_id }
    };
  }
}
</script>

