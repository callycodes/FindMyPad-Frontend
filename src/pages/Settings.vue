<template>
  <div class="settings_page">

    <ImageTitle title="Settings"  />

    <MainContent>


      <b-card
          id="search-container"
          border-variant="dark"
          
          class="text-center mt-5 mx-auto"
        >
      <h1>Where do you Study/Work?</h1>

       <b-form class="d-flex mt-4 mb-3 clearfix">
      <b-form-input size="lg" class="float-left mb-0 mt-0 mr-3"  ref="autocomplete" v-model="location" placeholder="Start typing an address here and then click Find" list="address-recommendations"></b-form-input>
      <datalist id="address-recommendations">
        <option :key="index" v-for="(address, index) in searchResults">{{ address }}</option>
    </datalist>

    <b-button size="lg" class="w-25" @click="geocode" variant="secondary">Find</b-button>

       </b-form>

      <GmapMap
  :zoom="13"
  ref="googleMapsElement"
  map-id="9d791aeaba4faec3"
  style="width: 100%; height: 400px"
  :center="{lat: selected_location.lat, lng: selected_location.lng}"
>

<b-button slot="visible" size="lg" class="save-location-button" @click="saveLocation" variant="success">Save Location</b-button>

<GmapMarker
    ref="studyMarker"
    :position="{lat: selected_location.lat, lng: selected_location.lng}"
    @dragend="dragged"

    :clickable="true"
    :draggable="true"
    @click="center={lat: selected_location.lat, lng: selected_location.lng}"
    
    :icon="getMarkerIcon()"
  />

  


</GmapMap>

      </b-card>



      <b-card
          id="search-container"
          border-variant="dark"
          
          class="text-center mt-5 mx-auto"
        >
      <h1>Your Profile</h1>

       <b-form class="d-flex mt-4 mb-3 clearfix">
      <b-form-input size="lg" class="float-left mb-0 mt-0 mr-3" v-model="name"></b-form-input>
  

    <b-button size="lg" class="w-25" @click="saveProfile" variant="success">Save</b-button>

       </b-form>

      </b-card>


    <h4 class="font-raleway">Nothing to see down here...</h4>
    </MainContent>
    
  </div>
</template>

<script>

import ImageTitle from '../components/layouts/ImageTitle'
import MainContent from '../components/layouts/MainContent'
import {gmapApi} from 'vue2-google-maps'

export default {
  components: {
    ImageTitle,
    MainContent
  },
  watch: {
      location (newValue) {
        if (newValue) {
          this.service.getPlacePredictions({
            input: this.location,
            types: []
          }, this.displaySuggestions);

        }
      }
    },
  methods: {
    saveProfile() {
      this.axios.put(this.serverURL + "/users/" + this.$store.state.user.id, 
      {
        name: this.name
      }).then(() => {
        this.$store.dispatch('sendConfetti', this.$confetti)
      });

      this.$store.state.user.name = this.name;
      this.$store.dispatch('setUser', this.$store.state.user)
    },
    saveLocation() {
      this.axios.put(this.serverURL + "/users/" + this.$store.state.user.id, 
      {
        study_latitude: this.selected_location.lat,
        study_longitude: this.selected_location.lng,
      }).then(() => {
        this.$store.dispatch('sendConfetti', this.$confetti)
      });
    },
    geocode() {
      this.geocoder.geocode({ address: this.location }, (results, status) => {
    if (status === "OK") {
      this.selected_location.lat = results[0].geometry.location.lat();
      this.selected_location.lng = results[0].geometry.location.lng();
      this.$refs.googleMapsElement.panTo(results[0].geometry.location);
      this.$refs.googleMapsElement.zoom(16);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
    },
    MapsInit () {
        this.service = new this.google.maps.places.AutocompleteService()
        this.geocoder = new this.google.maps.Geocoder();
        
      },
      displaySuggestions (predictions, status) {
        if (status !== this.google.maps.places.PlacesServiceStatus.OK) {
          this.searchResults = []
          return
        }
        this.searchResults = predictions.map(prediction => prediction.description) 
      },
    dragged(location) {
            this.selected_location = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
            };
        
    },
    getMarkerIcon () {
     
        return {
        url:
      "./assets/img/googlemaps/university.svg",
      scaledSize: {width: 32, height: 32}
    }
      
      
    },
    
  },
  
  
  data () {
    return {
      selected_location: {
          lat: 0,
          lng: 0,
        name: ''
      },
      name: this.$store.state.user.name,
      location: '',
      searchResults: [],
      service: null,
      place: null,
      geocoder: null
    }
  },
  computed: {
    google: gmapApi,
    getCurrentLocation: function() {
      return this.selected_location;
    }
  },
  mounted () {
    this.$store.state.loading = true;

    this.$gmapApiPromiseLazy().then(() => {
      this.MapsInit();

    }, this);
    this.axios.get(this.serverURL + "/users/" + this.$store.state.user.id).then((response) => {
        //console.log(response.data)
        this.selected_location.lat = response.data.user.study_latitude;
        this.selected_location.lng = response.data.user.study_longitude;
        this.selected_location.name = response.data.user.study_name;
        this.$store.state.loading = false;
    });
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.save-location-button {
  width: 200px;
  bottom: 10px;
  left: 10px;
  position: absolute;
}

h4 {
  margin-top: 100px;
  color: rgba(0, 0, 0, 0.2)
}
</style>
