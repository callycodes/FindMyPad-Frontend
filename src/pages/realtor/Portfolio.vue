<template>
<div id="portfolio">

  <b-row no-gutters class="property-container mx-auto w-100 p-4">
        <b-col xs="12" sm="6" lg="4" xl="3" v-for="(property, index) in properties" :key="index">
          
          <b-card border-variant="dark" class="property-card text-center mx-2 my-2" >
          
          <b-row no-gutters>
            <b-carousel id="image-carousel" :interval="4000" controls indicators>
              <b-carousel-slide v-for="(image, index2) in property.images" :key="index2" :img-src="image.url"></b-carousel-slide>
            </b-carousel>
          </b-row>

            <b-card-text class="">
              <h5 class="font-raleway">{{property.name}}</h5>

              <div class="property-statistics">
              <inline-svg class="mr-1" src="./assets/img/svg/visibility.svg"></inline-svg>
              <span class="mr-3">{{property.views}}</span>

              <inline-svg class="mr-1" src="./assets/img/svg/import.svg"></inline-svg>
              <span class="mr-3">{{property.imports}}</span>

              <b-button @click="remove(index)" variant="danger">Delete</b-button>
</div>
            </b-card-text>
        
          </b-card>
        </b-col>
      </b-row>

</div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  props: ['toggled'],
  components: {
    InlineSvg
  },
  computed: {

  },
  methods: {

    remove(index) {
      //Send delete request, on completion, toast user and remove from properties array
      this.axios.delete(this.serverURL + "/properties/" + this.properties[index].id).then(() => {
        this.$bvToast.toast('We have removed ' + this.properties[index].name, {
          title: `Property Removed`,
          variant: 'success',
          solid: true
        });

        this.properties.splice(index, 1);
      });
    }

  },
  mounted() {
    this.axios.get(this.serverURL + "/properties/user/" + this.$store.state.user.id).then((response) => {
      //console.log(response.data)
      this.properties = response.data.properties
    });

  },
  data() {
    return {
      properties: []
    }
  }
}
</script>

<style scoped>


svg {
  width: 20px;
  height: 20px;
  fill: rgba(0, 0, 0);
  margin-top: -8px;
}

.property-card {
  height: 300px;
  max-height: 300px;
}

.carousel {
  height: 130px;
  max-height: 130px;
}
.carousel-item {
  max-height: 130px;
}

.property-statistics {
  position: absolute;
  bottom: 10px;

}
</style>
