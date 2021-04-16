<template>
  <div v-bind:style="styleObject" id="image-container">
    <div class="title-container">
      <h1 class="title" v-if="title">{{title}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
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
        return "./assets/img/background/gray_map.png";
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

#image-container {
  width: 100%;
  height: 500px;
    background-size:     cover;                      /* <------ */
    background-repeat:   no-repeat;
    background-position: center center; 
}

.title-container {
  text-align: left;
  padding-top: 300px;
  width: 60%;
  text-align: center;
}

.title-container .title {
  font-family: 'Raleway', sans-serif;
  color: var(--white);
  font-size: 5vh;
  padding: 10px;
  background-color: var(--jet);

}

@media (max-width: 978px) {
  .title-container {
  
  width: 100%;
  text-align: center;
}
}


</style>