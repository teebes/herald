<template>
  <component :is="statusComponent"></component>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import StatusMPW from "./StatusMPW.vue";
import StatusSPW from "./StatusSPW.vue";

@Component({
  components: {
    StatusMPW,
    StatusSPW
  }
})
export default class WorldStatus extends Vue {
  get statusComponent() {
    if (this.$store.state.builder.world.is_multiplayer) {
      return StatusMPW;
    }
    return StatusSPW;
  }
}
</script>