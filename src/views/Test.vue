<template>
  <div id="test">
    <button @click="go">Go</button>
    <!-- <br />
    <div class="castbar" :ref="castbar" style="width: 100%"></div> -->
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TweenLite, TimelineLite, TweenMax } from "gsap";

@Component
export default class extends Vue {
  show: boolean = false;
  expanded: boolean = false;

  go() {
    const websocket = new WebSocket('ws://localhost:8888');
    console.log('sending');
    websocket.onopen = () => {
      websocket.send(JSON.stringify({'type': 'test.test'}));
      console.log('sent');

      // websocket.close()
      // console.log('closed');
    }
    
    // websocket.close();
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