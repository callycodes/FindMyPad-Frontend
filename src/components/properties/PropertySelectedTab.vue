<template>
<div id="selected-tab">

  <b-row no-gutters>
    <b-col cols="10">
  <h1>{{property.name}}</h1>
    </b-col>

    <b-col cols="2">
      <b-icon class="icon" @click="property.liked = !property.liked; $emit('like', property);" color="red" :icon="property.liked ? 'heart-fill' : 'heart'" style="width: 30px; height: 30px;"></b-icon>
    </b-col>
  </b-row>

  <b-row no-gutters class="property-info mb-2">

<b-col cols="8">
              <b-row>

                <b-col cols="2">
                <inline-svg src="./assets/img/svg/pound-sterling.svg"></inline-svg>
                </b-col>
                <b-col>
                <span v-if="property.transaction_type == 'BUY'" class="font-montserrat">£{{property.sale_price}}</span>
                <div class="rent" v-else>
                  <span class="font-montserrat">£{{property.monthly_price}}pcm </span>
                  <small class="font-montserrat">£{{property.weekly_price}}pw</small>
                  </div>
                </b-col>
              </b-row>
     </b-col>
      
<b-col cols="2">
      <inline-svg src="./assets/img/svg/bed.svg"></inline-svg>
                <span class="font-montserrat">{{property.bedrooms}}</span>
 </b-col>

                <b-col cols="2">
                <inline-svg src="./assets/img/svg/bath-tub.svg"></inline-svg>
                <span class="font-montserrat">{{property.bathrooms}}</span>
                 </b-col>
    </b-row>



    <div v-if="property.stations.length > 0" class="nearby-stations">
  <h2>Nearest Stations</h2>
  <div v-for="(station, index) in property.stations" :key="index" class="nearby-station-container">
    <b-row no-gutters>
      <b-col cols="1">
        <inline-svg v-if="station.type == 'LONDON_UNDERGROUND'" class="mr-2" src="./assets/img/svg/underground.svg"></inline-svg>
        <inline-svg v-else-if="station.type == 'NATIONAL_TRAIN'" class="mr-2" src="./assets/img/svg/national_train.svg"></inline-svg>
        <inline-svg width="20" height="20" v-else-if="station.type == 'LONDON_OVERGROUND'" class="mr-2" src="./assets/img/svg/london_overground.svg"></inline-svg>
      </b-col>
      <b-col>
        <p class="nearby-station-name font-montserrat">{{station.name}}</p>
        <small class="nearby-station-distance font-montserrt"><b>{{parseFloat(station.distance).toFixed(1)}}{{station.unit}}</b></small>
      </b-col>
    </b-row>
  </div>
  </div>

  
<br>

  <h2>Nearby Toggle</h2>
  <div class="toggle-icons w-100">
    <div class="d-flex justify-content-between">
      <inline-svg @click="nearby('bank')" :class="toggled['bank'] ? 'toggled' : ''" src="./assets/img/icons/bank-building.svg"></inline-svg>
      <inline-svg @click="nearby('worship')" :class="toggled['worship'] ? 'toggled' : ''" src="./assets/img/icons/pray.svg"></inline-svg>
      <inline-svg @click="nearby('bar')" :class="toggled['bar'] ? 'toggled' : ''" src="./assets/img/icons/cocktail.svg"></inline-svg>
      <inline-svg @click="nearby('cafe')" :class="toggled['cafe'] ? 'toggled' : ''" src="./assets/img/icons/coffee.svg"></inline-svg>
      <inline-svg @click="nearby('gym')" :class="toggled['gym'] ? 'toggled' : ''" src="./assets/img/icons/fitness.svg"></inline-svg>
    </div>

    <div class="d-flex justify-content-between">
      <inline-svg @click="nearby('park')" :class="toggled['park'] ? 'toggled' : ''" src="./assets/img/icons/park.svg"></inline-svg>
      <inline-svg @click="nearby('pharmacy')" :class="toggled['pharmacy'] ? 'toggled' : ''" src="./assets/img/icons/pharmacy.svg"></inline-svg>
      <inline-svg @click="nearby('food')" :class="toggled['food'] ? 'toggled' : ''" src="./assets/img/icons/restaurant.svg"></inline-svg>
      <inline-svg @click="nearby('shops')" :class="toggled['shops'] ? 'toggled' : ''" src="./assets/img/icons/supermarket-cart-silhouette.svg"></inline-svg>
      <inline-svg @click="nearby('laundry')" :class="toggled['laundry'] ? 'toggled' : ''" src="./assets/img/icons/washing-machine.svg"></inline-svg>
    </div>

  </div>

<br>
<br>

  <b-button-group class="d-flex">
    <b-button @click="showImages" squared class="font-montserrat" variant="outline-dark">Images</b-button>
    <b-button @click="showFeatures" squared class="font-montserrat" variant="outline-dark">Features</b-button>
  </b-button-group>

  <b-button @click="toggleAmazon" squared class="font-montserrat w-100 amazon-button" variant="outline-dark">Toggle Amazon Lockers</b-button>
  <b-button @click="toggleCycles" squared class="font-montserrat w-100 cycle-button" variant="outline-dark">Toggle Santander Cycles</b-button>

  <b-button @click="unselect" class="back-to-sort-btn">Back to Sort</b-button>
</div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  props: ['property', 'toggled'],
  components: {
    InlineSvg
  },
  computed: {

  },
  methods: {
    unselect() {
      this.$emit('unselect');
    },
    nearby(type) {
      this.toggled[type] = !this.toggled[type];

      this.$emit('nearby', type, this.toggled[type]);
    },
    showImages() {
      this.$emit('showImages');
    },
    showFeatures() {
      this.$emit('showFeatures');
    },
    toggleAmazon() {
      this.$emit('toggleAmazon');
    },
    toggleCycles() {
      this.$emit('toggleCycles');
    }
    

  },

  
  data() {
    return {
      
    }
  }
}
</script>

<style scoped>
#selected-tab {
  max-height: 550px;
  height: 550px;
  padding-left: 20px;
  padding-right: 20px;
}

#selected-tab h1 {
  font-size: 30px;
  font-family: 'Raleway', sans-serif;
}

#selected-tab h2 {
  margin-top: 5px;
  font-size: 20px;
  font-family: 'Raleway', sans-serif;
}

.back-to-sort-btn {
  position: absolute;
  background: black;
  font-family: 'Montserrat', sans-serif;
  bottom: 0px;
  left: 0px;
  width: 100%;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.toggle-icons {
  display: inline-block;
  margin-bottom: 0px;
}

.toggle-icons svg {
  width: 30px;
  height: 30px;
  fill: gray;
}

.toggle-icons div {
  margin-bottom: 8px;
}

.toggled {
  fill: black !important;
}
.nearby-station, .nearby-station-name, .nearby-station-distance {
  margin: 0px;
}

.nearby-station-distance {
  margin-top: -5px;
}

.nearby-station-name {
  margin-bottom: -10px;
  font-size: 15px;
}

.nearby-station-container svg {
  width: 20px;
  height: 20px;
}

.property-info svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.property-info .rent small {
  margin-top: -8px;
}

.amazon-button {
  color: black;
  text-decoration: underline;
  text-decoration-color: goldenrod;
  text-decoration-thickness: 2px;
}

.cycle-button {
  color: black;
  text-decoration: underline;
  text-decoration-color: red;
  text-decoration-thickness: 2px;
}

</style>
