<template>
  <b-row>
      <b-col cols="2">
    
    <!--Image carousel-->
    <b-carousel
    class="property-carousel"
      id="image-carousel"
      :interval="0"
      controls
      indicators
    >

    <b-carousel-slide v-for="image in property.images" :key="image.order" fluid :img-src="image.url"></b-carousel-slide>

          </b-carousel>

</b-col>

<b-col cols="7">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 font-raleway fw-900">{{property.name}}</h5>
      <b-icon class="icon" @click="like(index)" color="red" :icon="property.liked ? 'heart-fill' : 'heart'" style="width: 30px; height: 30px;"></b-icon>
      <!--<small>Imported on: {{new Date(property.imported_on).toLocaleDateString()}}</small>-->
    </div>

    <p class="icons">

                <b-img src="./assets/img/svg/pound-sterling.svg"></b-img>
                <span v-if="property.transaction_type == 'BUY'" class="font-montserrat">£{{property.sale_price}}</span>
                <span v-else class="font-montserrat">£{{property.monthly_price}}pcm <small>£{{property.weekly_price}}pw</small></span>
     
      

      <b-img src="./assets/img/svg/bed.svg"></b-img>
                <span class="font-montserrat">{{property.bedrooms}}</span>
                <b-img src="./assets/img/svg/bath-tub.svg"></b-img>
                <span class="font-montserrat">{{property.bathrooms}}</span>
                <b-img v-if="property.type != 'UNKNOWN'" src="./assets/img/svg/home.png"></b-img>
                <span v-if="property.type != 'UNKNOWN'" class="font-montserrat">{{property.type}}</span>
    </p>

<br>
    <p class="transport-icons">
<b-img src="./assets/img/svg/bike.svg"></b-img>
                <span v-if="cycle" class="font-montserrat">{{cycle.duration.text}}</span>
                <b-img src="./assets/img/svg/pedestrian-man.svg"></b-img>
                <span v-if="walk" class="font-montserrat">{{walk.duration.text}}</span>
                <b-img src="./assets/img/svg/steering-wheel.svg"></b-img>
                <span v-if="drive" class="font-montserrat">{{drive.duration.text}}</span>
                <b-img src="./assets/img/svg/train.svg"></b-img>
                <span v-if="transit" class="font-montserrat">{{transit.duration.text}}</span>
      </p>


</b-col>

<b-col class="property-buttons" cols="3">
<b-button squared class="w-100 font-montserrat" variant="outline-primary">View on Rightmove</b-button>
<b-button squared class="w-100 font-montserrat" @click="select(property); zoom(property)" variant="outline-secondary">View on Map</b-button>
<b-button squared class="w-100 font-montserrat" @click="remove(index)" variant="outline-danger">Remove</b-button>
</b-col>

    </b-row>
</template>

<script>

export default {
  props: ['property', 'index', 'cycle', 'walk', 'drive', 'transit'],
  components: {
  },
  computed: {
    
    
  },

  methods: {
    like(index) {
      this.$emit('like', index);
    },
    select(property) {
      this.$emit('select', property);
    },
    zoom(property) {
      console.log('zooming: ' + property.name)
      this.$emit('zoom', property);
    },
    remove(index) {
      this.$emit('remove', index);
    }

  },
  data () {
    return {
      
    }
  }
}

</script>

<style scoped>

.icons {
  display: inline-block;
}

.icons span {
  margin-right: 20px;
}

.icons img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.transport-icons {
  display: inline-block;
  margin-bottom: 0px;
}

.transport-icons span {
  margin-right: 20px;
}

.transport-icons img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.property-buttons .btn {
  padding: 4px;
  margin-bottom: 5px;
}

</style>
