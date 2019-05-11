// Dependencies
import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { i18n } from './plugins/i18n'
import { store } from './plugins/store'
import { startUpdatingData } from './utils/dataUpdater'
import './plugins/facebook'
import './plugins/vuetify'

Vue.config.productionTip = true

startUpdatingData()

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
