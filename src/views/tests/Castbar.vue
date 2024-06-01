<template>
  <div id="test">
    <button @click="go">Go</button>
    <br />
    <div class="castbar" ref="castbar" style="width: 200px"></div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from "vue";
import { gsap } from "gsap";

const expanded = ref(true);

const castbar = ref(null);

const go = () => {
  var castbarEl = castbar.value;

  if (!expanded.value) {
    // TweenLite.to(castbarEl, 3, { width: "200px" });
    gsap.to(castbarEl, { duration: 2, width: "200px" });
  } else {
    // TweenLite.to(castbarEl, 3, { width: "0" });
    gsap.to(castbarEl, { duration: 2, width: "0" });
    // TweenLite.to(castbar, 10, { width: "0%" });
  }
  expanded.value = !expanded.value;

}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#test {
  padding: 20px;
  .castbar {
    position: relative;
    width: 0;
    height: 20px;
    background: #ccccff;
  }
}
</style>