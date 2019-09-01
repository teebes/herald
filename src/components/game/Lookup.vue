<template>
  <div v-if="entity" id="lookup" :class="{ 'lookup-mobile': $store.state.game.is_mobile }">
    <component :is="lookupComponent()" :entity="entity" class="lookup" :lookup="lookup"></component>
  </div>
</template>

<script lang='ts'>
/* 
  Component to display more information about an item or mob that is being
  hovered over (desktop) or clicked on (mobile). 
*/

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import LookupItem from "./LookupItem.vue";
import LookupMob from "./LookupMob.vue";
import LookupNotFound from "./LookupNotFound.vue";

@Component({
  components: {
    LookupItem,
    LookupMob,
    LookupNotFound
  }
})
export default class GameLookup extends Vue {
  entity: any = null;

  @Watch("lookup")
  async onChangeLookup(lookup) {
    this.entity = null;
    await this.doLookup();
  }

  lookupComponent() {
    if (this.entity === "error") {
      return "LookupNotFound";
    }

    const type = this.entity.key.split(".")[0];
    if (type === "item") {
      return "LookupItem";
    }
    return "LookupMob";
  }

  get lookup() {
    return this.$store.state.game.lookup;
  }

  async mounted() {
    await this.doLookup();
  }

  async doLookup() {
    try {
      const resp = await axios.get(`/game/lookup/${this.lookup.key}/`, {
        headers: { "X-PLAYER-ID": this.$store.state.game.player.id }
      });
      this.entity = resp.data;
    } catch (e) {
      this.entity = "error";
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";

#lookup {
  width: 300px;
  padding: 10px;
  border: 3px solid $color-background-very-light;
  background: $color-background-light;

  &.lookup-mobile {
    border: 0;
    background: none;
    margin: 20px;

    .lookup {
      padding: 20px;
      background: $color-background-black;
    }
  }
}
</style>