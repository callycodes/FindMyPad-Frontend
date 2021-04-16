<template>
<div v-if="times" class="travel-view-container mb-3">
  <b-card class="w-100 h-100">

    <div class="travel-method-container w-50 h-100 float-left">
      <h1 class="information-title font-raleway">Travel Information</h1>

      <div v-if="times.drive" class="method-container clearfix">
        <h2 class="method-title font-montserrat float-left">
          <b-img src="./assets/img/svg/steering-wheel.svg"></b-img>
          Driving - {{times.drive.duration.text || ''}} <small>(one-way)</small>
        </h2>
        <b-button :disabled="method == 'DRIVING'" @click="changeMode('DRIVING')" squared class="d-flex font-montserrat float-left" variant="outline-dark">Directions</b-button>
        <div class="clearfix" />
        <h2 class="method-info invert font-montserrat float-left">Per Week: £{{calculatePetrolPrice()}}</h2>
        <h2 class="method-info invert font-montserrat float-left">Per Year: £{{calculatePetrolPrice() * 52}}</h2>
      </div>

      <div v-if="times.cycle" class="method-container clearfix">
        <h2 class="method-title font-montserrat float-left">
          <b-img src="./assets/img/svg/bike.svg"></b-img>
          Cycling - {{times.cycle.duration.text || ''}}
        </h2>
        <b-button :disabled="method == 'BICYCLING'" @click="changeMode('BICYCLING')" squared class="d-flex font-montserrat float-left" variant="outline-secondary">Directions</b-button>
      </div>

      <div v-if="times.walk" class="method-container clearfix">
        <h2 class="method-title font-montserrat float-left">
          <b-img src="./assets/img/svg/pedestrian-man.svg"></b-img>
          Walking - {{times.walk.duration.text || ''}}
        </h2>
        <b-button :disabled="method == 'WALKING'" @click="changeMode('WALKING')" squared class="d-flex font-montserrat float-left" variant="outline-secondary">Directions</b-button>
      </div>

      <div v-if="times.transit" class="method-container clearfix">
        <h2 class="method-title font-montserrat float-left">
          <b-img src="./assets/img/svg/train.svg"></b-img>
          Public Transport - {{times.transit.duration.text || ''}}
        </h2>
        <b-button :disabled="method == 'TRANSIT'" @click="changeMode('TRANSIT')" squared class="d-flex font-montserrat float-left" variant="outline-secondary">Directions</b-button>
        <!--
        Unfortunately I can't yet calculate return fares because no API offers this
          <div class="clearfix" />
        <h2 class="method-info invert font-montserrat float-left">Return Fare Daily/Monthly</h2>
        <h2 class="method-info invert font-montserrat float-left">£7.90</h2>
        <h2 class="method-info invert font-montserrat float-left">£38.20</h2>-->
      </div>

    </div>

    <div class="directions-container w-50 p-3 h-100 float-right">

      <slot></slot>
    </div>

  </b-card>
</div>
</template>

<script>
import {
  gmapApi
} from 'vue2-google-maps'

export default {
  props: ['property', 'study', 'times', 'method'],
  components: {},
  computed: {
    google: gmapApi,

  },

  methods: {

    changeMode(mode) {
      this.$emit('change-mode', mode);
    },
    getFare() {

      this.axios.get("https://api.tfl.gov.uk/Journey/JourneyResults/NW1%201BD/to/51.500150%2C-0.126240?date=20210325&time=0900&timeIs=Arriving&journeyPreference=LeastInterchange&mode=tube").then((response) => {
        this.fare = response.data;
      });

    },
    calculatePetrolPrice() {
      var distance = (this.times.drive) ? this.times.drive.distance.value : 0;
      var fuel_price = 130;
      var mpg = 51.7;
      var amt_needed = (((distance / mpg) * (fuel_price / 100) / 3.78541));
      return parseFloat((amt_needed * 5 * 2) / 100).toFixed(2);
    }
  },
  mounted() {
    //this.changeMode('DRIVING');
    console.log('Travel View Mounted')
  },
  updated() {

  },
  data() {
    return {
      directionRenderer: null,
      directionService: null,
      fare: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.travel-view-container {
  height: 320px;
}

.method-title {
  border: 1px black solid;
  font-size: 16px;
  padding: 8px;
  width: 70%;
  margin-right: 5px;
}

.method-title img {
  height: 18px;
}

.directions-container {
  overflow: scroll;
}

.method-info {
  border: 1px black solid;
  font-size: 16px;
  padding: 8px;
  margin-right: 5px;
}

.method-info img {
  height: 18px;
}

.invert {
  background-color: black;
  color: white;
}

.method-container {
  margin-bottom: 5px;
}

.information-title {
  font-size: 2vw;
}
</style>
