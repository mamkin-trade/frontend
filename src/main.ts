import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { FBSignInButton } from './middlewares/facebook'
import VueI18n from 'vue-i18n'
import { messages } from './localization'

Vue.use(VueI18n);
Vue.config.productionTip = true
Vue.use(FBSignInButton)

const i18n = new VueI18n({
  locale: 'ru',
  messages,
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
