<template>
  <div id="app">
    <Notification v-if="$store.state.ui.notification" />

    <Header v-if="showHeader" />

    <div id="main">
      <router-view />
    </div>

    <Modal v-if="$store.state.ui.modal" />
  </div>
</template>


<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

// Third party imports
import VueAnalytics from "vue-analytics";
import axios from "axios";
import VTooltip from "v-tooltip";
import VueClosable from "vue-closable";
import { TweenLite } from "gsap";

// Own packages
import { ANALYTICS_ID } from "@/config.ts";
import Header from "./components/Header.vue";
import Notification from "./components/Notification.vue";
import Modal from "./components/Modal.vue";
import store from "@/store";
import { capfirst } from "@/core/utils.ts";
import { interactive } from "@/core/directives.ts";
import VueCarousel from "vue-carousel";

TweenLite.lagSmoothing(0);

Vue.prototype.$capfirst = capfirst;
Vue.prototype.$http = axios;
Vue.use(VTooltip);
Vue.use(VueClosable);
Vue.use(VueCarousel);

if (ANALYTICS_ID) {
  Vue.use(VueAnalytics, {
    id: ANALYTICS_ID,
    checkDuplicatedScript: true
  });
}

// Custom directives
Vue.directive("interactive", interactive);

@Component({
  components: {
    Notification,
    Header,
    Modal
  }
})
export default class App extends Vue {
  get showHeader() {
    if (
      this.$route.name == "home" ||
      this.$route.name == "game" ||
      this.$route.name == "homedirect"
    ) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="scss">
@import "styles/app.scss";
</style>
