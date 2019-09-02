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
import axios from "axios";

import Header from "./components/Header.vue";
import Notification from "./components/Notification.vue";
import Modal from "./components/Modal.vue";
import store from "@/store";

import { capfirst } from "@/helpers/utils.ts";
import VTooltip from "v-tooltip";
import VueClosable from "vue-closable";

import { interactive } from "@/core/directives.ts";

import { TweenLite } from "gsap";

TweenLite.lagSmoothing(0);

Vue.prototype.$capfirst = capfirst;
Vue.prototype.$http = axios;
Vue.use(VTooltip);
Vue.use(VueClosable);

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