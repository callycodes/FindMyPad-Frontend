<template>
  <div v-bind:style="styleObject" id="image-page">
    <slot></slot>
  </div>
</template>

<script>

export default {
  props: {
    image: String
  },

  data () {
    return {
    }
  },
  computed: {
    getImageUrl () {
      if (this.image) {
        return this.image
      } else {
        return "./assets/img/headers/pexels-mike-463996.jpg";
      }
    },
    styleObject () {
        return {
          backgroundImage: `url(${this.getImageUrl})`
        }
      }
  }
}
</script>

<style scoped>

#image-page {
  width: 100%;
  
  height: 100vh;
    background-size:     cover;                      /* <------ */
    background-repeat:   no-repeat;
    background-position: center center; 
}


</style>