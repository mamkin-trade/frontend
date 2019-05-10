// Dependencies
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './utils/i18n'
import { store } from './store'
import { startUpdatingData } from './utils/dataUpdater'

Vue.config.productionTip = true

Vue.use(require('vue-facebook-signin-button'))

startUpdatingData()

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
