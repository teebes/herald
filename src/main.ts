import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import GAuth from "vue-google-oauth2";

Vue.config.productionTip = false;

// axios interceptor to set auth token
import interceptorSetup from './helpers/axiosInterceptors'
interceptorSetup()

const gauthOption = {
  clientId: "12867366661-5nhmig35463vuvmnmo3ea4usruvfo61s.apps.googleusercontent.com",
  scope: "profile email",
  prompt: "select_account"
}
Vue.use(GAuth, gauthOption);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
