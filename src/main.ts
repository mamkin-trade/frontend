// Dependencies
import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { store } from './plugins/store'
import { i18n } from './plugins/i18n'
import { startUpdatingData } from './utils/dataUpdater'
import './plugins/facebook'
import './plugins/google'
import './plugins/vuetify'

Vue.config.productionTip = true

startUpdatingData()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
