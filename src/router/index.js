import Vue from 'vue'
import Router from 'vue-router'
import Element from 'element-ui'
import Home from '@/components/Home/home'
import More from '@/components/More/more'
import Map from '@/components/Map/map'
import User from '@/components/User/user'
import Register from '@/components/Register/register'
Vue.use(Router)
Vue.use(Element)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Register',
      component: Register
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/more',
      name: 'More',
      component: More
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
  ]
})
