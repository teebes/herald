<template>
  <div class="progress-bar">
    <div class="progress-fill" ref="progress" :style="{width: initialWidth}"></div>
    <div class="progress-label">{{ label }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TweenLite, Linear } from "gsap";

@Component
export default class ProgressBar extends Vue {
  @Prop() duration!: number;
  @Prop() label!: string;
  @Prop() method!: string; // cast, channeled
  @Prop() expires!: number;
  @Prop() start!: number;

  initialWidth: string = "0";

  constructor() {
    super();
    if (this.method === "channel") {
      this.initialWidth = "100%";
    }
  }

  mounted() {
    const progress = this.$refs.progress as HTMLElement;

    let duration = this.duration * 1000;
    let perc = 0;
    if (this.start) {
      const current = new Date().getTime();
      const elapsed = current - this.start;
      duration = duration - elapsed;
      perc = Math.round((100 * elapsed) / duration);
    }

    if (duration < 0) return;

    // Since we don't want to re-animate this every time it's mounted
    // we mark it as started and then don't re-start it if it's
    // already complete.
    // Would be more robust for tabbing away and back on mobile if
    // we resumed, which can be done as a future improvement.
    if (!this.start) {
      if (this.$store.state.game.started_casts[this.expires]) {
        if (this.method === "channel") {
          progress.setAttribute("style", "width: 0");
        } else {
          progress.setAttribute("style", `width: 100%`);
        }
        return;
      } else if (this.expires) {
        this.$store.commit("game/started_casts_add", {
          expires: this.expires
        });
      }
    }

    if (this.method === "channel") {
      perc = 100 - perc;
      progress.setAttribute("style", `width: ${perc}%`);
      TweenLite.to(progress, duration / 1000, {
        width: "0%",
        ease: Linear.easeNone
      });
    } else {
      progress.setAttribute("style", `width: ${perc}%`);
      TweenLite.to(progress, duration / 1000, {
        width: "100%",
        ease: Linear.easeNone
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>