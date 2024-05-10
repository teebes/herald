import Vue from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';

// declare module '*.vue' {
//   import Vue from 'vue';
//   export default Vue;
// }

declare module 'vue/types/vue' {
  interface Vue {
    $gAuth: any;
    $store: Store<any>;
    $router: VueRouter;
  }
}