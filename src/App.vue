<template>
  <div id="app">
    <div v-if="this.$store.state.loading" id="loading">
      <div class="d-flex justify-content-center mb-3 spinner-container">
    <b-spinner class="spinner"></b-spinner>
  </div>
      </div>
    <Nav ref="navbar" />
    <transition name="fade">
      <router-view id="page" />
    </transition>
  </div>
</template>

<script>
import Nav from './components/Nav'

export default {
  name: 'App',
  components: {
    Nav
  },

  data () {
    return {
      windowWidth: window.innerWidth,
    }
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onChangeSize);
    })
  },

  beforeDestroy() { 
    window.removeEventListener('resize', this.onChangeSize); 
  },
  methods: {  
    onChangeSize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth > 1200) {
        this.$refs.navbar.show();
      } else if (this.windowWidth < 1200) {
        this.$refs.navbar.hide();
      }


    }
  }
}
</script>

<style>

#loading {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color:rgb(255, 255, 255, 0.8);
  vertical-align: middle;
}

.spinner-container {
  position: absolute;
  left: calc(50% - 50px);
  top: calc(50% - 50px);
}

.spinner-container .spinner {
  height: 100px;
  width: 100px;
}

#app {
  margin-left: 300px;
  transition: transform 1s;
}

@media (max-width: 1200px) {
  #app {
  margin-left: 0px;
}
}

</style>
