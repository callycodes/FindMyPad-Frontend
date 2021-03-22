import Vue from 'vue'
import App from './App.vue'
import store from './store/store.js'

import axios from 'axios'
import VueAxios from 'vue-axios'

import router from './router'

import * as VueGoogleMaps from 'vue2-google-maps'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const config = require('./config.js');

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueAxios, axios)

Vue.use(VueGoogleMaps, {
  load: {
    key: config.getGoogleMapsApiKey(),
    libraries: 'places, drawing'
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
