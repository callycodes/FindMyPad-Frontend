import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './pages/Home.vue'
import AddProperty from './pages/AddProperty.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import MyProperties from './pages/MyProperties.vue'
import Settings from './pages/Settings.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add',
    name: 'Add Property',
    component: AddProperty
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/properties',
    name: 'My Properties',
    component: MyProperties
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
  ]
  /* ,
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue')
  } */
})

export default router