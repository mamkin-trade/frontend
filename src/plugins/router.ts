import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Cabinet from '../views/Cabinet.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import User from '../views/User.vue'
import { store } from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPolicy,
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: Cabinet,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User,
    },
  ],
})

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = store.state.user

  if (requiresAuth && !user) {
    next('/')
  } else {
    if (to.path === '/' && user) {
      next('/cabinet')
    } else {
      next()
    }
  }
})

export default router
