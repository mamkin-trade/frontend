import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cabinet from './views/Cabinet.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: Cabinet,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = store.state.user

  console.log(requiresAuth && !currentUser.token)
  
  if (requiresAuth && !currentUser.token) next('/')
  else if (!requiresAuth && currentUser.token) next('cabinet')
  else next()
})

export default router;