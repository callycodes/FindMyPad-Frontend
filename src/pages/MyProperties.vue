<template>
  <div class="hello">
    <MainContent>

      <b-row no-gutters class="mb-3">

        <b-col md="12" lg="3" class="mb-3 mb-md-3">
          <b-card class="h-100 mr-0 mr-md-3">
<p>{{getTravelViewRendered}}</p>
            <div v-if="selected_property" id="more-info-container">
                <h1>{{selected_property.name}}</h1>
                
                <b-button @click="deselectProperty" class="back-to-sort-btn">
                  Back to Sort</b-button>
                </div>

              <div v-else id="sorting-container">
                <h1>Sort</h1>
                <label for="radius_range">Study/Work Radius <b>{{sorting_properties.radius}}km</b></label>
    <b-form-input id="radius_range" v-model="sorting_properties.radius" @change="sortProperties('radius')" type="range" step="0.1" min="0" :max="convertMetersToKilometers(map_properties.max_radius) * 2"></b-form-input>

    <label for="walk_range">Max Walking Time <b>{{sorting_properties.walking_time}}mins</b></label>
    <b-form-input id="walk_range" v-model="sorting_properties.walking_time" @change="sortProperties('walk_time')" type="range" step="1" :min="map_properties.travel_times.walk.min" :max="map_properties.travel_times.walk.max"></b-form-input>

    <label for="cycle_range">Max Cycling Time <b>{{sorting_properties.cycling_time}}mins</b></label>
    <b-form-input id="cycle_range" v-model="sorting_properties.cycling_time" @change="sortProperties('cycle_time')" type="range" step="1" :min="map_properties.travel_times.cycle.min" :max="map_properties.travel_times.cycle.max"></b-form-input>


</div>
            </b-card>
          </b-col>

          <b-col md="12" lg="9">
      <GmapMap
      id="map"
  :center="{lat: 0, lng: 0}"
  ref="googleMapsElement"
  map-id="9d791aeaba4faec3"
  style="width: 100%; height: 600px"
  :options="map_options"
>

<DirectionsRenderer
            v-show="getTravelViewRendered"
                  :travelMode="direction_options.mode"
                  :origin="getSelectedPropertyPosition()"
                  :destination="{ lat: study.lat, lng: study.lng}"
                  :panel="this.$refs.direction_panel"
                  :renderer="directionRenderer"
                  :map="map"
                />

<div class="map-legend">

  </div>

<GmapMarker
    :position="{lat: study.lat, lng: study.lng}"
    :clickable="true"
    :draggable="false"
    @click="center={lat: study.lat, lng: study.lng}"
    
    :icon="getMarkerIcon('university')"
  />

  <GmapMarker
    :key="index"
    v-for="(p, index) in getProperties"
    :position="{lat: p.latitude, lng: p.longitude}"
    :clickable="true"
    :draggable="false"
    :v-model="properties[index].marker"
    @click="center={lat: p.latitude, lng: p.longitude}; setSelectedProperty(p); zoomToProperty(p);"
    :icon="getMarkerIcon('property', p)"
  />

  <GmapCircle
    :center="{lat: study.lat, lng: study.lng}"
    :radius="getSortRadius"
    :visible="true"
    :options="{fillColor:'blue',fillOpacity:0.01}"
  ></GmapCircle>

</GmapMap>

</b-col>

</b-row>

<transition
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
<TravelView ref="travel_view" v-show="getTravelViewRendered" :property="getSelectedProperty()" @change-mode="changeTravelMode" :method="direction_options.mode" :times="getTravelTimes()"><div class="overflow-scroll" ref="direction_panel"></div></TravelView>
</transition>

<b-list-group>


<b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-list-group-item class="flex-column align-items-start p-3">
    
    <b-row>
      <b-col cols="2">
    <b-skeleton-img></b-skeleton-img>

</b-col>

<b-col cols="7">
    <div class="d-flex w-100 justify-content-between">
      <b-skeleton width="85%"></b-skeleton>
    </div>

    <b-skeleton width="70%"></b-skeleton>
    <b-skeleton width="80%"></b-skeleton>
<b-skeleton width="90%"></b-skeleton>
<b-skeleton width="85%"></b-skeleton>

</b-col>

<b-col class="property-buttons" cols="3">
<b-skeleton class="mb-2" width="100%" type="button"></b-skeleton>
<b-skeleton class="mb-2" width="100%" type="button"></b-skeleton>
<b-skeleton class="mb-2" width="100%" type="button"></b-skeleton>
</b-col>

    </b-row>
  </b-list-group-item>
      </template>

  <b-list-group-item :variant="p.isVisible ? '' : 'secondary'" :key="index" v-for="(p, index) in getProperties" class="flex-column align-items-start p-3">
    
    <b-row>
      <b-col cols="2">
    <b-carousel
    class="property-carousel"
      id="image-carousel"
      :interval="0"
      controls
      indicators
    >

    <b-carousel-slide v-for="image in p.images" :key="image.order" fluid :img-src="image.url"></b-carousel-slide>

          </b-carousel>

</b-col>

<b-col cols="7">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 font-raleway fw-900">{{p.name}}</h5>
      <b-icon class="icon" @click="toggleLikeProperty(index)" color="red" :icon="p.liked ? 'heart-fill' : 'heart'" style="width: 30px; height: 30px;"></b-icon>
      <!--<small>Imported on: {{new Date(p.imported_on).toLocaleDateString()}}</small>-->
    </div>

    <p class="icons">
      <b-img src="./assets/img/svg/pound-sterling.svg"></b-img>
                <span class="font-montserrat">£{{p.monthly_price}}pcm <small>£{{p.weekly_price}}pw</small></span>
      <b-img src="./assets/img/svg/bed.svg"></b-img>
                <span class="font-montserrat">{{p.bedrooms}}</span>
                <b-img src="./assets/img/svg/bath-tub.svg"></b-img>
                <span class="font-montserrat">{{p.bathrooms}}</span>
                <b-img v-if="p.type != 'UNKNOWN'" src="./assets/img/svg/home.png"></b-img>
                <span v-if="p.type != 'UNKNOWN'" class="font-montserrat">{{p.type}}</span>
    </p>

<br>
    <p class="transport-icons">
<b-img src="./assets/img/svg/bike.svg"></b-img>
                <span v-if="cycling_routes[index]" class="font-montserrat">{{cycling_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/pedestrian-man.svg"></b-img>
                <span v-if="walking_routes[index]" class="font-montserrat">{{walking_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/steering-wheel.svg"></b-img>
                <span v-if="driving_routes[index]" class="font-montserrat">{{driving_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/train.svg"></b-img>
                <span v-if="transit_routes[index]" class="font-montserrat">{{transit_routes[index].duration.text}}</span>
      </p>


</b-col>

<b-col class="property-buttons" cols="3">
<b-button squared class="w-100 font-montserrat" variant="outline-primary">View on Rightmove</b-button>
<b-button squared class="w-100 font-montserrat" @click="setSelectedProperty(p); zoomToProperty(p)" variant="outline-secondary">View on Map</b-button>
<b-button squared class="w-100 font-montserrat" @click="removeProperty(index)" variant="outline-danger">Remove</b-button>
</b-col>

    </b-row>
  </b-list-group-item>
</b-skeleton-wrapper>
  
</b-list-group>


    </MainContent>
    
  </div>
</template>

<script>

import MainContent from '../components/layouts/MainContent'
import TravelView from '../components/TravelView'
import {gmapApi} from 'vue2-google-maps'
import Vue from 'vue'
import DirectionsRenderer from '../components/DirectionsRenderer.js'

export default {
  components: {
    MainContent,
    TravelView,
    DirectionsRenderer
  },
  computed: {
    google: gmapApi,
    getSortRadius: function() {
      return parseInt(this.sorting_properties.radius) * 1000;
    },
    
    getProperties: function() {

      return this.properties;
    },
    getVisibility: function() {
      return this.isVisible ? true : false;
    },
    getTravelViewRendered: function() {
      return this.travel_view_rendered
    }
    
  },

  methods: {
    getSelectedPropertyPosition() {
      if (this.getSelectedProperty()) {
        return {
          lat: this.getSelectedProperty().latitude,
          lng: this.getSelectedProperty().longitude
        }
      } else {
        return null
      }
    },
    deselectProperty() {
      this.setSelectedProperty(null);
      this.resetBounds();
    },
    getSelectedProperty() {
      return this.selected_property;
    },
    changeTravelMode(mode) {
      this.direction_options.mode = mode;
    },
    getTravelTimes() {
      if (!this.getSelectedProperty()) {
        return null
      }

      var index = this.getPropertyIndex();
      var obj = null;
      if (index) {
        obj = {
          walk: this.walking_routes[index],
          cycle: this.cycling_routes[index],
          drive: this.driving_routes[index],
          transit: this.transit_routes[index],
        };
      }
      return obj;
    },
    getPropertyIndex() {
      for (var i = 0; i < this.properties.length; i++) {
        
        if (this.properties[i].name == this.getSelectedProperty().name) {
          return i;
        }
      }
    },
    //Sets the min and max times for each method of transport, then
    //used as the range sliders.
    calculateMinMaxTravelTimes() {

      var walk_min = 100000;
      var walk_max = -1;

      var cycle_min = 100000;
      var cycle_max = -1;

      /* var drive_min = 100000;
      var drive_max = -1;

      var transit_min = 100000;
      var transit_max = -1; */

      for (var i = 0; i < this.properties.length; i++) {
        
        if (this.walking_routes[i].duration.value < walk_min) {
          walk_min = this.walking_routes[i].duration.value;
        }

        if (this.walking_routes[i].duration.value > walk_max) {
          walk_max = this.walking_routes[i].duration.value;
        }

        if (this.cycling_routes[i].duration.value < cycle_min) {
          cycle_min = this.cycling_routes[i].duration.value;
        }

        if (this.cycling_routes[i].duration.value > cycle_max) {
          cycle_max = this.cycling_routes[i].duration.value;
        }
        
      }

      this.map_properties.travel_times.walk.min = Math.floor(walk_min / 60);
      this.map_properties.travel_times.walk.max = Math.floor(walk_max / 60);

      this.map_properties.travel_times.cycle.min = Math.floor(cycle_min / 60);
      this.map_properties.travel_times.cycle.max = Math.floor(cycle_max / 60);

      this.sorting_properties.radius = this.convertMetersToKilometers(this.map_properties.max_radius) * 2;
      this.sorting_properties.walking_time = this.map_properties.travel_times.walk.max;
      this.sorting_properties.cycling_time = this.map_properties.travel_times.cycle.max;

      
    },
    convertMetersToKilometers(m) {
      return Math.round((m / 1000));
    },
    distanceTo(o) {
  var lat = [this.study.lat, o.latitude]
  var lng = [this.study.lng, o.longitude]
  var R = 6378137;
  var dLat = (lat[1]-lat[0]) * Math.PI / 180;
  var dLng = (lng[1]-lng[0]) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.round(d);
    },

    removeProperty(index) {
      if (this.selected_property.name == this.properties[index].name) {
        this.setSelectedProperty(null);
      }

      this.$bvToast.toast('We have removed ' + this.properties[index].name, {
          title: `Property Removed`,
          variant: 'success',
          solid: true
        });

      this.properties.splice(index, 1);
      
        this.resetBounds();
    },
    resetBounds() {
      this.$gmapApiPromiseLazy().then(() => {
        this.map_properties.bounds = new this.google.maps.LatLngBounds();

        for (let property of this.getProperties) {
                const pos = new this.google.maps.LatLng(property.latitude, property.longitude);
                this.map_properties.bounds.extend(pos);
              }

              const pos = new this.google.maps.LatLng(this.study.lat, this.study.lng);
                this.map_properties.bounds.extend(pos);

              this.$refs.googleMapsElement.fitBounds(this.map_properties.bounds);
        });
        
    },
    async toggleLikeProperty(index) {
      this.properties[index].liked = !this.properties[index].liked;
      await this.updateProperty(this.properties[index]);
      
    },

    setSelectedProperty(val) {
          this.selected_property = val;
          
        
      
      //this.renderTravelView();
    },
    async updateProperty(property) {
      return this.axios.put("http://127.0.0.1:5000/properties/" + property.id, 
      property)
    },
    prioritiseProperty() {
      //var temp = this.properties[0];
      //this.properties[0] = this.properties[index];
      //this.properties[index] = temp;
    },
    async zoomToProperty(property) {
      //this.prioritiseProperty(index);
      
      this.$refs.googleMapsElement.panTo({lat: property.latitude,
      lng: property.longitude});
      console.log('ozomed to property');
      //this.$refs.googleMapsElement.zoom = 16;
      //this.$refs.googleMapsElement.zoomTo({zoom: 15});
      
    },
    generateURL (mode) {
      let url = "https://maps.googleapis.com/maps/api/distancematrix/json?" +
        `destinations=${this.study.lat},${this.study.lng}` +
        "&departure_time=now" +
        "&mode=" + mode + 
        "&units=imperial" +
        "&key=AIzaSyCxDmQmRHIzBcyb--l2UOhsCj07sItNYjo&origins="

      for (let property in this.properties) {
        url = url + `${this.properties[property].latitude},${this.properties[property].longitude}|`
      }

      url = url.slice(0,-1)
      return url
    },
    async collectRoutes () {
      
        let walking_url = this.generateURL('walking')
        await this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(walking_url)).then((response) => {
          for (let value of response.data.rows) {
            this.walking_routes.push(value.elements[0])
              
          }
        })

        let cycling_url = this.generateURL('bicycling')
        await this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(cycling_url)).then((response) => {
          for (let value of response.data.rows) {
            this.cycling_routes.push(value.elements[0])
              
          }
        })


        let driving_url = this.generateURL('driving')
        await this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(driving_url)).then((response) => {
          for (let value of response.data.rows) {
            this.driving_routes.push(value.elements[0])
              
          }
        })

        let transit_url = this.generateURL('transit')
        await this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(transit_url)).then((response) => {
          for (let value of response.data.rows) {
            this.transit_routes.push(value.elements[0])
              
          }
        })
    },
    getMarkerIcon (type, property = null) {
      if (type == 'university') {
        return {
        url:
      "./assets/img/googlemaps/" + type + ".svg",
      scaledSize: {width: 32, height: 32}
    }
      } else if (type == 'work') {
        return {
        url:
      "./assets/img/googlemaps/" + type + ".svg",
      scaledSize: {width: 32, height: 32}
    }
      } else {
        if (property.isVisible) {
          return {
        url:
      "./assets/img/googlemaps/" + type + ".svg",
      scaledSize: {width: 32, height: 32}
    }
        } else {
          return {
        url:
      "./assets/img/googlemaps/property_gray.svg",
      scaledSize: {width: 32, height: 32}
    }
        }
      }
      
    },

    renderTravelView() {
        // Remove my-component from the DOM
        this.travel_view_rendered = false;
        this.$nextTick(() => {
          this.travel_view_rendered = true;
          console.log('render')
        })
          // Add the component back in
          
      },

      removeTravelView() {
this.$nextTick(() => {
          this.travel_view_rendered = false;
          console.log('derender')
        })
          // Add the component back in
      
      },

    sortProperties() {

      this.properties.forEach(function(property, index) {

        //Sort by radius

        if (property.distanceToStudy >= this.getSortRadius) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.walking_time < Math.floor(this.walking_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.cycling_time < Math.floor(this.cycling_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);
        } else {
          Vue.set(property, 'isVisible', true);
        }

      }, this);
      
      this.$forceUpdate();
    },
    
  },
  watch: {
    selected_property: function (val) {
      console.log('Selected Propety watched changed to: ' + val)
      if (val != null) {
        
        this.renderTravelView();
      } else {
        this.removeTravelView();
      }
    }
  },
  mounted () {
this.$store.state.loading = true

this.$gmapApiPromiseLazy().then(() => {
  this.directionServices = new this.google.maps.DirectionsService();
  this.directionRenderer = new this.google.maps.DirectionsRenderer();
  this.map = this.$refs.googleMapsElement.$mapObject;
  this.directionRenderer.setMap(this.map);
});

      this.axios.get("http://127.0.0.1:5000/users/" + this.$store.state.user.id).then((response) => {
        //console.log(response.data)
        this.study.lat = response.data.user.study_latitude;
        this.study.lng = response.data.user.study_longitude;
    });



      this.axios.get("http://127.0.0.1:5000/properties/user/" + this.$store.state.user.id).then((response) => {
        //console.log(response.data)
        this.properties = response.data.properties


        this.properties.forEach(function (property) {
          property.isVisible = true;
          let distance = this.distanceTo(property);
          property.distanceToStudy = distance;
          if (this.map_properties.max_radius < distance) {
            this.map_properties.max_radius = distance;
          }
          }, this);

        
        

        //console.log(response.data.properties)
        this.collectRoutes().then(() => {
          this.calculateMinMaxTravelTimes();
          this.$store.state.loading = false;
        })

        

        this.resetBounds();
        this.loading = false;
        
})




      
      
  },
  data () {
    return {
      travel_view_rendered: false,
      sorting_properties: {
        radius: 0,
        cycling_time: 0,
        walking_time: 0,
        driving_time: 0,
        transit_time: 0
      },
      map_options: {
        zoom: 13,
        center: {lat: 0, lng: 0}
      },
      loading: true,
      map_properties: {
        bounds: [],
        max_radius: 0,
        travel_times: {
          cycle: {
            min: -1,
            max: 0
          },
          walk: {
            min: -1,
            max: 0
          },
          drive: {
            min: -1,
            max: 0
          },
          transit: {
            min: -1,
            max: 0
          }
        }
      },
      study: {
        lat:0,
        lng:0
      },
      selected_property: null,
      properties: [],
      cycling_routes: [],
      walking_routes: [],
      driving_routes: [],
      transit_routes: [],
      markers: [
        {
        }
      ],
      directionRenderer: null,
      directionServices: null,
      map: null,
      direction_options: {
        mode: 'DRIVING'
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#more-info-container h1 {
  font-size: 25px;
}

.list-group-item .icons {
  display: inline-block;
}

.list-group-item .icons span {
  margin-right: 20px;
}

.list-group-item .icons img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.list-group-item .transport-icons {
  display: inline-block;
  margin-bottom: 0px;
}

.list-group-item .transport-icons span {
  margin-right: 20px;
}

.list-group-item .transport-icons img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.property-buttons .btn {
  padding: 4px;
  margin-bottom: 5px;
}

.map-legend {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 9999;
}

.list-group-item {
  padding: 0px;
}

.property-info-item-container img {
  max-height: 20px;
  padding: 0px;
  margin: 0px;
  margin-right: 5px;
}

.property-info-item-container .col-4 {
  text-align: center;
}

.delete-property-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  border-radius: 0px;
  padding: 2px 10px 4px 12px;
  background-color: red;
  border: none;
  border-bottom-left-radius: 12px;
}

.view-property-btn {
  
  padding: 4px 12px 4px 12px;
  line-height: 20px;
  border: none;
}

.back-to-sort-btn {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

</style>
