<template>
  <div class="progress-bar">
    <div class="progress-fill" ref="progress" :style="{width: initialWidth}"></div>
    <div class="progress-label">{{ label }}</div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { gsap } from "gsap";

const store = useStore();

const props = defineProps<{
  duration: number;
  label: string;
  expires?: number;
  start?: number;
  method: string;
}>();

const initialWidth = ref('0');
const progress = ref<HTMLElement | null>(null);


if (props.method === 'channel') {
  initialWidth.value = '100%';
}

onMounted(() => {
  const progressElement = progress.value as HTMLElement;

  let duration = props.duration * 1000;
  let perc = 0;
  if (props.start) {
    const current = new Date().getTime();
    const elapsed = current - props.start;
    duration = duration - elapsed;
    perc = Math.round((100 * elapsed) / duration);
  }

  if (duration < 0) return;

  // Since we don't want to re-animate this every time it's mounted
  // we mark it as started and then don't re-start it if it's
  // already complete.
  // Would be more robust for tabbing away and back on mobile if
  // we resumed, which can be done as a future improvement.
  if (!props.start) {
    if (props.expires && store.state.game.started_casts[props.expires]) {
      if (props.method === "channel") {
        progressElement.setAttribute("style", "width: 0");
      } else {
        progressElement.setAttribute("style", `width: 100%`);
      }
      return;
    } else if (props.expires) {
      store.commit("game/started_casts_add", {
        expires: props.expires
      });
    }
  }

  if (props.method === "channel") {
    perc = 100 - perc;
    progressElement.setAttribute("style", `width: ${perc}%`);
    gsap.to(progressElement, {
      duration: duration / 1000,
      width: "0%",
      ease: "none"
    });
  } else {
    progressElement.setAttribute("style", `width: ${perc}%`);
    gsap.to(progressElement, {
      duration: duration / 1000,
      width: "100%",
      ease: "none"
    });
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>