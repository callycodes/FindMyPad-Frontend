<template>
  <div class="hello">

    <ImageTitle title="Home"  />

    <MainContent>
      <h1>Welcome to UniAccom</h1>
      <p>content will go here</p>
    </MainContent>
    
  </div>
</template>

<script>

import ImageTitle from '../components/layouts/ImageTitle'
import MainContent from '../components/layouts/MainContent'

export default {
  components: {
    ImageTitle,
    MainContent
  },
  methods: {
    
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
