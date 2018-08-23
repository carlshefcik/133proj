import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Secure from '@/components/secure'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/secure',
      name: 'Secure',
      component: Secure
    }
  ]
})
