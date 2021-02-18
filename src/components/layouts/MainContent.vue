<template>
  <div id="main">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },

  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<style scoped>

#main {
  width: 100%;
  height: 100%;
  padding: 20px;
}

h1 {
  font-family: 'Raleway', sans-serif;
  font-weight: 900;
}

p {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
}

</style>