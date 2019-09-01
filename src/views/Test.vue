<template>
  <div id="test">
    <button @click="go">Go</button>
    <br />
    <div class="castbar" :ref="castbar" style="width: 100%"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TweenLite, TimelineLite, TweenMax } from "gsap";

@Component
export default class extends Vue {
  show: boolean = false;
  expanded: boolean = false;

  get castbar() {
    return "castbar";
  }

  go() {
    // const t1 = new TweenMax({
    //   onComplete: function() {
    //     console.log("complete!");
    //   }
    // });
    var castbar = this.$refs.castbar;
    if (!this.expanded) {
      console.log("expanding");
      TweenLite.to(castbar, 10, { width: "200px" });
      // TweenLite.to(castbar, 10, { width: "100%" });
    } else {
      console.log("contracting");
      TweenLite.to(castbar, 10, { width: "0" });
      // TweenLite.to(castbar, 10, { width: "0%" });
    }
    this.expanded = !this.expanded;

    // console.log("done!");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#test {
  padding: 20px;
  .castbar {
    position: relative;
    //width: 100px;
    width: 0;
    //max-width: 200px;
    height: 20px;
    background: #ccccff;
  }

  // .castbar-enter-active,
  // .castbar-leave-active {
  //   transition: width;
  //   transition-duration: 2s;
  // }
  // .castbar-enter,
  // .castbar-leave-to {
  //   width: 0;
  // }
}
</style>