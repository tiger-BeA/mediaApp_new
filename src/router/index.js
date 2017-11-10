import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueCookies from 'vue-cookie'
import $ from 'jquery'
import {Button, Card, Row, Col} from 'element-ui'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueLazyload from 'vue-lazyload'

import Home from '@/components/Home/home'
import More from '@/components/More/more'
import Map from '@/components/Map/map'
import User from '@/components/User/user'
import Register from '@/components/Register/register'
Vue.use(Router);
Vue.use(MintUI);
Vue.use(Resource);
Vue.use(VueCookies);
Vue.use(Button);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(VueLazyload);

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
