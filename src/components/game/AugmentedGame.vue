<template>
  <component
    :is="gameComponent"
    :messages="messages"
    @input="onInput"
    :width="width"
  ></component>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import Desktop from "./Desktop.vue";
import Mobile from "./mobile/Index.vue";

@Component({
  components: {
    Desktop,
    Mobile,
  },
})
export default class AugmentedGame extends Vue {
  @Prop() messages: any;
  @Prop() width!: number;

  onInput(args) {
    this.$emit("input", args);
  }

  get gameComponent() {
    if (this.width <= 768) {
      return "Mobile";
    }
    return "Desktop";
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
</style>
