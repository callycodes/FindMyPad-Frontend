import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './pages/Home.vue'
import AddProperty from './pages/AddProperty.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import MyProperties from './pages/MyProperties.vue'
import Settings from './pages/Settings.vue'

import Portfolio from './pages/realtor/Portfolio.vue'

import store from './store/store.js'

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
    component: AddProperty,
    meta: {
      authorize: ['student', 'realtor']
    }
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
    component: MyProperties,
    meta: {
      authorize: ['student']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      authorize: ['student']
    }
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio,
    meta: {
      authorize: ['realtor']
    }
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

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta;
  const currentUser = store.state.user;

  if (authorize) {
      if (!currentUser) {
          // not logged in so redirect to login page with the return url
          return next({ path: '/', query: { returnUrl: to.path } });
      }

      // check if route is restricted by role
      if (authorize.length && !authorize.includes(currentUser.role)) {
          // role not authorised so redirect to home page
          return next({ path: '/' });
      }
  }

  next();
})

VueRouter.prototype.absoluteURL = function(url, newTab = true) {
  const link = document.createElement('a')
  link.href = url
  link.target = newTab ? '_blank' : ''
  if (newTab) link.rel = 'noopener noreferrer' // IMPORTANT to add this
  link.click()
}

export default router