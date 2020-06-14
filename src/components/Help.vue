<template>
  <div class="help-icon">
    <img
      alt="help"
      src="~@/assets/ui/help_icon_2x.png"
      v-tooltip="tooltip_content"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() help!: string;

  get tooltip_content() {
    return {
      content: this.help,
      trigger: "hover click",
      autoHide: false,
      delay: { hide: 200 },
      classes: "help-tooltip"
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
