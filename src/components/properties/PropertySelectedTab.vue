<template>
<div id="selected-tab">

  <b-row class="property-top-container" no-gutters>
    <b-col cols="10">
  <h1 class="property-title">{{property.name}}</h1>
    </b-col>

    <b-col class="mt-3" cols="2">
      <b-icon class="icon" @click="property.liked = !property.liked; $emit('like', property);" color="red" :icon="property.liked ? 'heart-fill' : 'heart'" style="width: 30px; height: 30px;"></b-icon>
    </b-col>
  </b-row>

  <b-row no-gutters class="property-info mb-2">

<b-col class="d-flex" cols="6">

                <inline-svg src="./assets/img/svg/pound-sterling.svg"></inline-svg>
                <span v-if="property.transaction_type == 'BUY'" class="font-montserrat">£{{property.sale_price}}</span>
                <div class="rent" v-else>
                  <span class="font-montserrat">£{{property.monthly_price}}pcm </span>
                  <small class="font-montserrat">£{{property.weekly_price}}pw</small>
                  </div>
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

<br>


  <div class="d-flex">
  <div @click="showImages" class="image-btn-container">
    <span class="font-raleway image-btn-text">Images ({{property.images.length}})</span>
    <b-img fluid rounded :src="property.images[0].url">
      
    </b-img>
  </div>

    <div class="property-button-container">
      <b-button v-if="selectedOption == 'info'" @click="selectedOption = 'stations'" squared class="font-montserrat" variant="dark"><inline-svg src="./assets/img/svg/train.svg"></inline-svg> Stations</b-button>
      <b-button v-else @click="selectedOption = 'info'" squared class="font-montserrat" variant="dark"><inline-svg src="./assets/img/svg/information.svg"></inline-svg> Info</b-button>
      
    <b-button @click="showFeatures" squared class="font-montserrat" variant="dark"><inline-svg src="./assets/img/svg/list.svg"></inline-svg> Features</b-button>
    </div>

  </div>


  <br>

  <div class="d-flex">
  <div @click="showImages" class="image-btn-container realtor-btn-container">
    
    <b-img fluid rounded :src="property.realtor.logo">
      
    </b-img>
  </div>

    <div class="realtor-button-container">
      <b-form inline>
      <!--
        No need for the website button currently as site doesnt store a url 
        <b-button @click="openURL(property.realtor." squared class="d-flex font-montserrat" variant="dark"><inline-svg src="./assets/img/svg/internet.svg"></inline-svg> Website</b-button>-->
      <b-button @click="openTelephoneURL(property.realtor.phone)" squared class="d-flex font-montserrat" variant="dark"><inline-svg src="./assets/img/svg/call.svg"></inline-svg> Phone</b-button>
     </b-form>
     </div>

  </div>

  <br>

<div class="property-info-container" v-if="selectedOption == 'info'">
<h2>Information</h2>
  <span v-if="property.let_available"><inline-svg src="./assets/img/svg/calendar.svg"></inline-svg><b>Let available:</b> {{property.let_available}}<br></span>
  <span v-if="property.furnished"><inline-svg src="./assets/img/svg/armchair.svg"></inline-svg><b>Furnished:</b> {{property.furnished}}<br></span>
  <span v-if="property.let_type"><inline-svg src="./assets/img/svg/clock.svg"></inline-svg><b>Let type:</b> {{property.let_type}}<br></span>
  <span v-if="property.deposit && property.deposit > 0"><inline-svg src="./assets/img/svg/download.svg"></inline-svg><b>Deposit:</b> £{{property.deposit}}<br></span>
</div>

   <div v-else-if="property.stations.length > 0 && selectedOption == 'stations'" class="nearby-stations">
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

  <div v-else>
<h2>No nearby stations found</h2>
<small>Unfortunately, {{property.imported_from}} couldn't provide this information</small>
  </div>

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
    
    showImages() {
      this.$emit('showImages');
    },
    showFeatures() {
      this.$emit('showFeatures');
    },
    openTelephoneURL(phone) {
      this.$router.absoluteURL('tel:' + phone);
    }
    

  },

  
  data() {
    return {
      selectedOption: 'info'
    }
  }
}
</script>

<style scoped>
#selected-tab {
  max-height: 600px;
  height: 600px;
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

.property-info {
  background-color: black;

  margin-left: -1.25rem;
  margin-right: -1.25rem;
  padding: 10px;
  color: white;
}

.property-info svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: white;
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

.realtor-btn-container {
  width: 40% !important;
}

.image-btn-container {
  width: 45%;

transition: 1s;
  transform:
    perspective(75em)
    rotateX(18deg);
  box-shadow:
    rgba(22, 31, 39, 0.42) 0px 60px 123px -25px,
    rgba(19, 26, 32, 0.08) 0px 35px 75px -35px;
  border-radius: 10px;
  border: 1px solid;
  border-color:
    rgb(213, 220, 226)
    rgb(213, 220, 226)
    rgb(184, 194, 204);
}

.image-btn-container:hover {
  transform: translate3d(0px, -5px, 0px);
}

.image-btn-text {
  position: absolute;
  top: 0px;
  width: 100%;
  left: 0px;
  color: white;
  background-color: rgba(0, 0, 0, 1);
  padding: 2px;
  border-radius: 4px;
  padding-left: 5px;
}

.property-button-container {
  width: 50%;
  margin-left: 15px;
  margin-top: 5px;
}

.property-button-container button {
  display: flex;
  width: 100%;
  background-color: black;
  height: 45px;
  line-height: 30px;
  margin-bottom: 10px;
}

.realtor-button-container {
  margin-left: 15px;
  margin-top: 3px;
}

.realtor-button-container button {
  display: flex;
  height: 45px;
  line-height: 30px;
  background-color: black;
  margin-right: 15px;
}

.property-button-container button svg {
  margin-top: 5px;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: white;
}

.realtor-button-container button svg {
  margin-top: 5px;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: white;
}

.property-top-container {
  max-height: 70px;
  margin-bottom: 10px;
  overflow: hidden;
}

.property-info-container svg {
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-right: 5px;
}
</style>
