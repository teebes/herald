import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// axios interceptor to set auth token
import interceptorSetup from './helpers/axiosInterceptors'
interceptorSetup()

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
