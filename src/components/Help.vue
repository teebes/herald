<!--
  Component usage:

  

  elementSchema = {}
  elementSchema.help = `The mob's class determine how its stats are calculated. For
                 example, warriors will roll more strength and thieves will roll
                 more dexterity.<br/>
                 If abilities are enabled, also determines which skills are used.`,

  <Help v-if="elementSchema.help" :help="elementSchema.help"></Help>
-->

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
