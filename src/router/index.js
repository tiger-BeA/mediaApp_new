import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueCookies from 'vue-cookie'
import $ from 'jquery'
import VueLocalStorage from 'vue-localstorage'
import {Button, Card, Row, Col, Upload, Dialog} from 'element-ui'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueLazyload from 'vue-lazyload'

import Index from '@/components/Index/index'
import Login from '@/components/Login/login'
import Register from '@/components/Register/register'
import SelfInfo from '@/components/Register/info'
import NewMedia from '@/components/Upload/NewMedia/newMedia'
import NewReport from '@/components/Upload/NewReport/newReport'
import MyCollect from '@/components/Favorites/favorites'
import MyReport from '@/components/Report/report'

Vue.use(VueLocalStorage)
Vue.use(Router);
Vue.use(MintUI);
Vue.use(Resource);
Vue.use(VueCookies);
Vue.use(Button);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(VueLazyload);
Vue.use(Upload);
Vue.use(Dialog);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/register/info',
      name: 'SelfInfo',
      component: SelfInfo
    }, {
      path: '/newMedia',
      name: 'NewMedia',
      component: NewMedia
    }, {
      path: '/newReport',
      name: 'NewReport',
      component: NewReport
    }, {
      path: '/myCollect',
      name: 'MyCollect',
      component: MyCollect
    }, {
      path: '/myReport',
      name: 'MyReport',
      component: MyReport
    }
  ]
});

