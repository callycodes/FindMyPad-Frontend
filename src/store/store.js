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
      },
      SEND_CONFETTI(state, plugin) {
        plugin.start();
        setTimeout(() => {
          plugin.stop();
        }, 2000);
      }
    },
    getters: {
    },
  
    actions: {
      sendConfetti(store, plugin) {
        console.log(plugin);
        store.commit('SEND_CONFETTI', plugin)
      },
      setUser(store, value) {
        store.commit('SET_USER', value)
      },
      logoutUser(store) {
        store.commit('LOGOUT_USER')
      }
    }
});