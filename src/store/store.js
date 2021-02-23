import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      loading: false,
      user: JSON.parse(localStorage.getItem('user'))
    },
    mutations: {
      SET_USER(state, user) {
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user
      },
      LOGOUT_USER(state) {
        localStorage.removeItem('user');
        state.user = null
      }
    },
    getters: {
    },
  
    actions: {
  
      setUser(store, value) {
        store.commit('SET_USER', value)
      },
      logoutUser(store) {
        store.commit('LOGOUT_USER')
      }
    }
});