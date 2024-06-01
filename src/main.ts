import { createApp } from 'vue'
import './styles/app.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import interceptorSetup from '@/core/axiosInterceptors'
import vue3GoogleLogin from 'vue3-google-login'
import { interactive } from '@/core/directives'
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import '@/styles/floating-vue-custom.scss';

interceptorSetup();

createApp(App)
  .use(router)
  .use(store)
  .use(vue3GoogleLogin, {
    clientId: '12867366661-5nhmig35463vuvmnmo3ea4usruvfo61s.apps.googleusercontent.com',
  })
  .use(FloatingVue)
  .directive('interactive', interactive)
  .mount('#app')
