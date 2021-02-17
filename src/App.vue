<template>
  <div id="app">
    <Nav ref="navbar" />
    <router-view id="page" />
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
      }
    }
  }
}
</script>

<style>
#app {
  margin-left: 400px;
}

@media (max-width: 1200px) {
  #app {
  margin-left: 0px;
}
}

#page {
}
</style>
