<template>
<div class="my-properties">

  <Advertisement v-if="showingAdvertisement" :study="study" :properties="properties" @add="addProperty" @close="showingAdvertisement = false"></Advertisement>

  <MainContent v-if="getProperties.length > 0 && study.lat != null">

    <b-row no-gutters class="mb-1">

      <b-col md="12" lg="4" class="mb-1 mb-md-1">
        <b-card class="h-100 mr-0 mr-md-3 p-0">

          <PropertySelectedTab class="p-0" v-if="selected_property" :property="selected_property" @like="updateProperty" @showFeatures="selectedPropertyFeaturesWindow='mini'" @showImages="selectedPropertyWindow='mini'" @unselect="deselectProperty"></PropertySelectedTab>

          <div v-else id="sorting-container">
            <h1>Sort</h1>
            <label for="radius_range">Study/Work Radius <b>{{sorting_properties.radius}}km</b></label>
            <b-form-input id="radius_range" v-model="sorting_properties.radius" @change="sortProperties('radius')" type="range" step="0.1" min="0" :max="convertMetersToKilometers(map_properties.max_radius) * 2"></b-form-input>

            <label for="walk_range">Max Walking Time <b>{{sorting_properties.walking_time}}mins</b></label>
            <b-form-input id="walk_range" v-model="sorting_properties.walking_time" @change="sortProperties('walk_time')" type="range" step="1" :min="map_properties.travel_times.walk.min" :max="map_properties.travel_times.walk.max"></b-form-input>

            <label for="cycle_range">Max Cycling Time <b>{{sorting_properties.cycling_time}}mins</b></label>
            <b-form-input id="cycle_range" v-model="sorting_properties.cycling_time" @change="sortProperties('cycle_time')" type="range" step="1" :min="map_properties.travel_times.cycle.min" :max="map_properties.travel_times.cycle.max"></b-form-input>

            <label for="drive_range">Max Driving Time <b>{{sorting_properties.driving_time}}mins</b></label>
            <b-form-input id="drive_range" v-model="sorting_properties.driving_time" @change="sortProperties('drive_time')" type="range" step="1" :min="map_properties.travel_times.drive.min" :max="map_properties.travel_times.drive.max"></b-form-input>

            <label for="transit_range">Max Transit Time <b>{{sorting_properties.transit_time}}mins</b></label>
            <b-form-input id="transit_range" v-model="sorting_properties.transit_time" @change="sortProperties('transit_time')" type="range" step="1" :min="map_properties.travel_times.transit.min" :max="map_properties.travel_times.transit.max"></b-form-input>

            <label class="font-raleway" for="sale_selector">Sale Type <b>({{saleTypeSelected}})</b></label>
            <b-form-radio-group v-model="saleTypeSelected" :options="saleTypeOptions" @change="sortProperties('sale')"
              class="mb-3"
              id="sale_selector"
              value-field="item"
              text-field="name"
            ></b-form-radio-group>

            <label class="font-raleway" for="type_selector">Property Type <b>({{propertyTypeSelected}})</b></label>
            <b-form-radio-group v-model="propertyTypeSelected" :options="propertyTypeOptions" @change="sortProperties('type')"
              class="mb-3"
              id="type_selector"
              value-field="item"
              text-field="name"
            ></b-form-radio-group>

            <label class="font-raleway" for="furnish_selector">Furnished Type <b>({{furnishedTypeSelected}})</b></label>
            <b-form-radio-group v-model="furnishedTypeSelected" :options="furnishedTypeOptions" @change="sortProperties('furnish')"
              class="mb-3"
              id="furnish_selector"
              value-field="item"
              text-field="name"
            ></b-form-radio-group>

          </div>

        </b-card>
      </b-col>

      <b-col md="12" lg="8">
        <GmapMap id="map" :center="{lat: 0, lng: 0}" ref="googleMapsElement" map-id="9d791aeaba4faec3" style="width: 100%; height: 640px" :options="map_options">

          <DirectionsRenderer v-show="travel_view_rendered" :travelMode="direction_options.mode" :origin="getSelectedPropertyPosition()" :destination="{ lat: study.lat, lng: study.lng}" :panel="this.$refs.direction_panel" :renderer="directionRenderer" :map="map" />

          <Toggles v-show="travel_view_rendered" slot="visible" :toggled="toggledButtons" @toggleCycles="gatherNearbyCycles()" @toggleAmazon="gatherNearbyLockers()"></Toggles>

          <Nearby v-if="travel_view_rendered" slot="visible" :toggled="toggled" @nearby="toggleNearbyPlaces"></Nearby>
          

          <div v-if="selectedPropertyWindow" slot="visible" :class="[selectedPropertyWindow != 'full' ? 'mini' : '', 'selected-property-images']">
                <div class="options">
                  <h2 class="float-left ml-2">Photo Gallery</h2>
                  <inline-svg @click="selectedPropertyWindow=''" src="./assets/img/window/close.svg"></inline-svg>
                  <inline-svg v-if="selectedPropertyWindow == 'full'" @click="selectedPropertyWindow = 'mini'" src="./assets/img/window/minimize.svg"></inline-svg>
                  <inline-svg v-else @click="selectedPropertyWindow = 'full'" src="./assets/img/window/expand.svg"></inline-svg>
                </div>

                <b-carousel
    class="property-carousel"
      id="image-carousel"
      :interval="0"
      controls
      indicators
    >

    <b-carousel-slide v-for="image in selected_property.images" :key="image.order" fluid :img-src="image.url"></b-carousel-slide>

          </b-carousel>
          </div>

          <div v-if="selectedPropertyFeaturesWindow" slot="visible" :class="[selectedPropertyFeaturesWindow != 'full' ? 'mini' : '', 'selected-property-features']">
                <div class="options">
                  <h2 class="float-left ml-2">Features</h2>
                  <inline-svg @click="selectedPropertyFeaturesWindow=''" src="./assets/img/window/close.svg"></inline-svg>
                  <inline-svg v-if="selectedPropertyFeaturesWindow == 'full'" @click="selectedPropertyFeaturesWindow = 'mini'" src="./assets/img/window/minimize.svg"></inline-svg>
                  <inline-svg v-else @click="selectedPropertyFeaturesWindow = 'full'" src="./assets/img/window/expand.svg"></inline-svg>
                </div>

              <div class="features d-flex w-100">
                <ul>
                  <li v-for="(feature, index) in selected_property.features" :key="index">{{feature.feature}}</li>
                </ul>

                <span v-if="selected_property.description">{{selected_property.description}}</span>
              </div>
          </div>

          <div v-if="nearbyHover" slot="visible" class="nearby-place-info">
            <h2>{{nearbyHover.name}}</h2>
            <b-icon icon="x-circle" scale="1" variant="danger" @click="setHoverNearby(null)"></b-icon>

          </div>

          <GmapMarker :position="{lat: study.lat, lng: study.lng}" :clickable="true" :draggable="false" @click="center={lat: study.lat, lng: study.lng}" :icon="getMarkerIcon('university')" />

          <GmapMarker :key="index" v-for="(p, index) in getProperties" :position="{lat: p.latitude, lng: p.longitude}" :clickable="true" :draggable="false" :v-model="properties[index].marker" @click="center={lat: p.latitude, lng: p.longitude}; setSelectedProperty(p); zoomToProperty(p);" :icon="getMarkerIcon('property', p)" />

          <GmapMarker :key="'nearby_place'+index" v-for="(place, index) in getNearbyPlaces()" :position="{lat: place.location.lat, lng: place.location.lng}" :clickable="true" :draggable="false" @click="center={lat: place.location.lat, lng: place.location.lng}; setHoverNearby(place)" :icon="getMarkerFromUrl(place.icon)" />

          <GmapCircle :center="{lat: study.lat, lng: study.lng}" :radius="getSortRadius" :visible="true" :options="{fillColor:'blue',fillOpacity:0.01}"></GmapCircle>

        </GmapMap>

      </b-col>

    </b-row>

      <TravelView ref="travel_view" v-show="travel_view_rendered" :property="getSelectedProperty()" @change-mode="changeTravelMode" :method="direction_options.mode" :times="getTravelTimes()">
        <div class="overflow-scroll" ref="direction_panel"></div>
      </TravelView>

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

          <PropertyListItem :property="p" :index="index" :drive="driving_routes[index]" :walk="walking_routes[index]" :cycle="cycling_routes[index]" :transit="transit_routes[index]" @select="setSelectedProperty" @like="toggleLikeProperty" @remove="removeProperty" @zoom="zoomToProperty"></PropertyListItem>

        </b-list-group-item>
      </b-skeleton-wrapper>

    </b-list-group>

  </MainContent>

  <ImageFull v-show="getProperties.length == 0">
    <MainContent>
    <b-card 
          border-variant="dark"
          class="text-center error-container mt-5 mx-auto"
        >

        <h1 class="font-raleway">No Properties Found</h1>
        <span class="font-montserrat">It looks like you haven't added any properties yet, add some <a><router-link to="/add">here</router-link></a></span>

        </b-card>
    </MainContent>
  </ImageFull>

  <ImageFull v-show="study.lat == null">
    <MainContent>
    <b-card 
          border-variant="dark"
          class="text-center error-container mt-5 mx-auto"
        >

        <h1 class="font-raleway">Set your place of Study</h1>
        <span class="font-montserrat">It looks like you haven't selected your place of study/work yet, change it <a><router-link to="/settings">here</router-link></a></span>

        </b-card>
    </MainContent>
  </ImageFull>

</div>
</template>

<script>
import MainContent from '../components/layouts/MainContent'
import TravelView from '../components/TravelView'
import {
  gmapApi
} from 'vue2-google-maps'
import Vue from 'vue'
import DirectionsRenderer from '../components/DirectionsRenderer.js'
import PropertyListItem from '../components/properties/PropertyListItem'
import PropertySelectedTab from '../components/properties/PropertySelectedTab'
import InlineSvg from 'vue-inline-svg';
import ImageFull from "../components/layouts/ImageFull";
import Toggles from "../components/map/Toggles"
import Nearby from "../components/map/Nearby"
import Advertisement from "../components/realtor/Advertisement"

export default {
  components: {
    MainContent,
    TravelView,
    DirectionsRenderer,
    PropertyListItem,
    PropertySelectedTab,
    InlineSvg,
    ImageFull,
    Toggles,
    Nearby,
    Advertisement
  },
  computed: {
    google: gmapApi,
    getSortRadius: function () {
      return parseInt(this.sorting_properties.radius) * 1000;
    },

    getProperties: function () {

      return this.properties;
    },
    getVisibility: function () {
      return this.isVisible ? true : false;
    },
    getTravelViewRendered: function () {
      return this.travel_view_rendered
    }

  },

  methods: {
    async resetPage() {
      this.properties.forEach(function (property) {
        property.isVisible = true;
        let distance = this.distanceTo(property);
        property.distanceToStudy = distance;
        if (this.map_properties.max_radius < distance) {
          this.map_properties.max_radius = distance;
        }
      }, this);
      await this.collectRoutes();
      await this.calculateMinMaxTravelTimes();
      await this.resetBounds();
    },
    addProperty(property) {
      this.properties.push(property);
      this.resetPage();
    },
    setHoverNearby(place) {
      if (place == null) {
        this.nearbyHover = null;
      } else {
        this.nearbyHover = place;
      }


    },

    getNearbyPlaces() {
      return this.nearby_places;
    },

    gatherNearbyCycles() {
     
        if (this.showingSantanderCycles) {
          this.toggledButtons.santander = false;
          this.toggleNearbyPlaces('santander_cycles', false);
          this.showingSantanderCycles = false;
          return;
        }
      

      var house_location = new this.google.maps.LatLng(this.selected_property.latitude,this.selected_property.longitude);
      var request = {
        location: house_location,
        name: 'Santander Cycles',
        radius: 2000,
        //fields: ['name','geometry']
      };

    
    this.showingSantanderCycles = true;
    this.toggledButtons.santander = true;

      this.placeServices.nearbySearch(request, (results, status) => {
        if (status == this.google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.nearby_places.push({
              type: 'santander_cycles',
              category: 'santander_cycles',
              name: results[i]['name'],
              icon: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Cycle_Hire_Logo.svg',
              location: {
                lat: results[i]['geometry'].location.lat(),
                lng: results[i]['geometry'].location.lng(),
              }
            })  
          }
        }
      });
    },
    gatherNearbyLockers() {
     
        if (this.showingAmazonLockers) {
          this.toggledButtons.amazon = false;
          this.toggleNearbyPlaces('amazon_locker', false);
          this.showingAmazonLockers = false;
          return;
        }
      

      var house_location = new this.google.maps.LatLng(this.selected_property.latitude,this.selected_property.longitude);
      var request = {
        location: house_location,
        name: 'Amazon Locker',
        radius: 2000,
        //fields: ['name','geometry']
      };

    
    this.showingAmazonLockers = true;
    this.toggledButtons.amazon = true;

      this.placeServices.nearbySearch(request, (results, status) => {
        if (status == this.google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.nearby_places.push({
              type: 'amazon_locker',
              category: 'amazon_locker',
              name: results[i]['name'],
              icon: 'https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg',
              location: {
                lat: results[i]['geometry'].location.lat(),
                lng: results[i]['geometry'].location.lng(),
              }
            })  
          }
        }
      });
    },
    gatherNearbyPlaces(type, category) {
      var house_location = new this.google.maps.LatLng(this.selected_property.latitude,this.selected_property.longitude);

      var request = {
        location: house_location,
        radius: '500',
        type: type
      };

      this.placeServices.nearbySearch(request, (results, status) => {
        if (status == this.google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.nearby_places.push({
              type: type,
              category: category,
              name: results[i]['name'],
              icon: results[i]['icon'],
              location: {
                lat: results[i]['geometry'].location.lat(),
                lng: results[i]['geometry'].location.lng(),
              }
            })
          }
        }
      });
    },
    //Triggered on event emit from selected property tab
    // -type: place type, park, cafe etc
    // -showing: has the option been toggled on(true) or off(false)
    toggleNearbyPlaces(type, showing) {
      if (showing == true) {
        var types = [];
        if (type == 'worship') {
          types.push('synagogue', 'church', 'hindu_temple', 'mosque');
        } else {
          types.push(type);
        }

        //Get the nearby places using Google Places API, push results to nearby_places var
        for (var i = 0; i < types.length; i++) {
          this.gatherNearbyPlaces(types[i], type);
        }


      } else {
        //If showing is false, we are removing nearby markers.
        //Create new empty array
        let remaining = [];

        //Then if category doesn't match the type we deselected, store this in new array
        for (var x = 0; x < this.nearby_places.length; x++) {
          if (this.nearby_places[x].category != type) {
            remaining.push(this.nearby_places[x]);
          }
        }

        //Then assign this new array, we have removed the specific category of places we deselected.
        this.nearby_places = remaining;
      }
    },
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
    resetNearbyPlaces() {
      //also reset the selected icons
      this.resetNearbyIcons();
      this.nearby_places = [];
      this.setHoverNearby(null);
      this.selectedPropertyWindow = '';
      this.showingAmazonLockers = false;
      this.showingSantanderCycles = false;
      this.toggledButtons = {
        santander: false,
        amazon: false
      }
    },
    resetNearbyIcons() {
          this.toggled = {
          bank: false,
          worship: false,
          bar: false,
          cafe: false,
          gym: false,
          park: false,
          food: false,
          pharmacy: false,
          shops: false,
          laundry: false
        }
    },
    deselectProperty() {
      this.setSelectedProperty(null);
      this.resetBounds();
      this.resetNearbyPlaces();
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
      if (index != null) {
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
      var walk_max = 1;

      var cycle_min = 100000;
      var cycle_max = 1;

      var drive_min = 100000;
      var drive_max = 1;

      var transit_min = 100000;
      var transit_max = 1;

      /* var drive_min = 100000;
      var drive_max = -1;

      var transit_min = 100000;
      var transit_max = -1; */

      for (var i = 0; i < this.properties.length; i++) {

        try {
          if (this.walking_routes[i].duration.value < walk_min) {
            walk_min = this.walking_routes[i].duration.value;
          }

          if (this.walking_routes[i].duration.value > walk_max) {
            walk_max = this.walking_routes[i].duration.value;
          }
        } catch (e) {
          console.log('Error: Calculating Min and Max Walk Times');
        }

        try {
          if (this.cycling_routes[i].duration.value < cycle_min) {
            cycle_min = this.cycling_routes[i].duration.value;
          }

          if (this.cycling_routes[i].duration.value > cycle_max) {
            cycle_max = this.cycling_routes[i].duration.value;
          }
        } catch (e) {
          console.log('Error: Calculating Min and Max Cycle Times');
        }

        try {
          if (this.driving_routes[i].duration.value < drive_min) {
            drive_min = this.driving_routes[i].duration.value;
          }

          if (this.driving_routes[i].duration.value > drive_max) {
            drive_max = this.driving_routes[i].duration.value;
          }
        } catch (e) {
          console.log('Error: Calculating Min and Max Drive Times');
        }

        try {
          if (this.transit_routes[i].duration.value < transit_min) {
            transit_min = this.transit_routes[i].duration.value;
          }

          if (this.transit_routes[i].duration.value > transit_max) {
            transit_max = this.transit_routes[i].duration.value;
          }
        } catch (e) {
          console.log('Error: Calculating Min and Max Transit Times');
        }

      }

      this.map_properties.travel_times.walk.min = Math.floor(walk_min / 60);
      this.map_properties.travel_times.walk.max = Math.floor(walk_max / 60);

      this.map_properties.travel_times.cycle.min = Math.floor(cycle_min / 60);
      this.map_properties.travel_times.cycle.max = Math.floor(cycle_max / 60);

      this.map_properties.travel_times.drive.min = Math.floor(drive_min / 60);
      this.map_properties.travel_times.drive.max = Math.floor(drive_max / 60);

      this.map_properties.travel_times.transit.min = Math.floor(transit_min / 60);
      this.map_properties.travel_times.transit.max = Math.floor(transit_max / 60);

      this.sorting_properties.radius = this.convertMetersToKilometers(this.map_properties.max_radius) * 2;
      this.sorting_properties.walking_time = this.map_properties.travel_times.walk.max;
      this.sorting_properties.cycling_time = this.map_properties.travel_times.cycle.max;
      this.sorting_properties.driving_time = this.map_properties.travel_times.drive.max;
      this.sorting_properties.transit_time = this.map_properties.travel_times.transit.max;


      

    },
    convertMetersToKilometers(m) {
      return Math.round((m / 1000));
    },
    distanceTo(o) {
      var lat = [this.study.lat, o.latitude]
      var lng = [this.study.lng, o.longitude]
      var R = 6378137;
      var dLat = (lat[1] - lat[0]) * Math.PI / 180;
      var dLng = (lng[1] - lng[0]) * Math.PI / 180;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return Math.round(d);
    },

    removeProperty(index) {

      //If a property is selected, check if deleted property is selected, if so, deselect
      //and reset map bounds.
      if (this.selected_property && this.selected_property.name == this.properties[index].name) {
        this.setSelectedProperty(null);
        this.resetBounds();
      }

      //Send delete request, on completion, toast user and remove from properties array
      this.axios.delete("http://127.0.0.1:5000/properties/" + this.properties[index].id).then(() => {
        this.$bvToast.toast('We have removed ' + this.properties[index].name, {
          title: `Property Removed`,
          variant: 'success',
          solid: true
        });

        this.properties.splice(index, 1);
      });

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
      this.resetNearbyPlaces();
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
      this.$refs.googleMapsElement.panTo({
        lat: property.latitude,
        lng: property.longitude
      });

    },
    generateURL(mode) {
      let url = "https://maps.googleapis.com/maps/api/distancematrix/json?" +
        `destinations=${this.study.lat},${this.study.lng}` +
        "&departure_time=now" +
        "&mode=" + mode +
        "&units=imperial" +
        "&key=AIzaSyCxDmQmRHIzBcyb--l2UOhsCj07sItNYjo&origins="

      for (let property in this.properties) {
        url = url + `${this.properties[property].latitude},${this.properties[property].longitude}|`
      }

      url = url.slice(0, -1)
      return url
    },
    async collectRoutes() {
      try {
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
      } catch (e) {
        console.log('Error: Collecting Routes');
      }
    },
    getMarkerFromUrl(url) {
      return {
          url: url,
          scaledSize: {
            width: 32,
            height: 32
          }
        }
    },
    getMarkerIcon(type, property = null) {
      if (type == 'university') {
        return {
          url: "./assets/img/googlemaps/" + type + ".svg",
          scaledSize: {
            width: 32,
            height: 32
          }
        }
      } else if (type == 'work') {
        return {
          url: "./assets/img/googlemaps/" + type + ".svg",
          scaledSize: {
            width: 32,
            height: 32
          }
        }
      } else {
        if (property.isVisible) {
          return {
            url: "./assets/img/googlemaps/" + type + ".svg",
            scaledSize: {
              width: 32,
              height: 32
            }
          }
        } else {
          return {
            url: "./assets/img/googlemaps/property_gray.svg",
            scaledSize: {
              width: 32,
              height: 32
            }
          }
        }
      }

    },

    renderTravelView() {
      // Remove my-component from the DOM
      this.travel_view_rendered = false;
      this.$nextTick(() => {
        this.travel_view_rendered = true;
      })
      // Add the component back in

    },

    removeTravelView() {
      this.$nextTick(() => {
        this.travel_view_rendered = false;
      })
      // Add the component back in

    },

    sortProperties() {

      this.properties.forEach(function (property, index) {

        //Sort by radius
        if (property.distanceToStudy >= this.getSortRadius) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.walking_time < Math.floor(this.walking_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.cycling_time < Math.floor(this.cycling_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.driving_time < Math.floor(this.driving_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);
        } else if (this.sorting_properties.transit_time < Math.floor(this.transit_routes[index].duration.value / 60)) {
          Vue.set(property, 'isVisible', false);

        } else if (this.saleTypeSelected != 'BOTH' && property.transaction_type != this.saleTypeSelected) {
          Vue.set(property, 'isVisible', false);
        } else if (this.propertyTypeSelected != 'ALL' && !property.type.toUpperCase().includes(this.propertyTypeSelected)) {
          Vue.set(property, 'isVisible', false);
          console.log('type')
        
        } else if (this.furnishedTypeSelected != 'ALL' && property.furnished == null || this.furnishedTypeSelected != 'ALL' && !property.furnished.toUpperCase().includes(this.furnishedTypeSelected)) {
          Vue.set(property, 'isVisible', false);
        } else {
          Vue.set(property, 'isVisible', true);
        }

      }, this);

      this.$forceUpdate();
    },

  },
  watch: {

    //When selected_property is changed, property has been click/selected, or deselected, so render
    //travel tab according to current value.
    selected_property: function (val) {
      if (val != null) {

        this.renderTravelView();
      } else {
        this.removeTravelView();
      }
    }
  },
  async mounted() {
    //Start global loading animation

    this.$store.state.loading = true

    setInterval(function () {
        if (!this.showingAdvertisement) {
          this.showingAdvertisement = true;
        }
      }.bind(this), 300000);

    await this.axios.get("http://127.0.0.1:5000/users/" + this.$store.state.user.id).then((response) => {
      //console.log(response.data)
      this.study.lat = response.data.user.study_latitude;
      this.study.lng = response.data.user.study_longitude;
    });

    await this.axios.get("http://127.0.0.1:5000/properties/user/" + this.$store.state.user.id).then((response) => {
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
      
    })

    if (this.properties.length > 0 && this.study.lat != null) {
      await this.$gmapApiPromiseLazy().then(() => {
        this.directionServices = new this.google.maps.DirectionsService();
        this.directionRenderer = new this.google.maps.DirectionsRenderer();
        this.map = this.$refs.googleMapsElement.$mapObject;
        this.directionRenderer.setMap(this.map);

        this.placeServices = new this.google.maps.places.PlacesService(this.map);
      });


      await this.collectRoutes();
      await this.calculateMinMaxTravelTimes();

      await this.resetBounds();
    }

    this.$store.state.loading = false;
    this.loading = false;

  },
  data() {
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
        center: {
          lat: 0,
          lng: 0
        }
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
        lat: 0,
        lng: 0
      },
      selected_property: null,
      properties: [],
      cycling_routes: [],
      walking_routes: [],
      driving_routes: [],
      transit_routes: [],
      markers: [{}],
      directionRenderer: null,
      directionServices: null,
      placeServices: null,
      map: null,
      direction_options: {
        mode: 'DRIVING'
      },
      nearby_places: [],

      toggled: {
          bank: false,
          worship: false,
          bar: false,
          cafe: false,
          gym: false,
          park: false,
          food: false,
          pharmacy: false,
          shops: false,
          laundry: false
        },
        nearbyHover: null,
        selectedPropertyWindow: '',
        selectedPropertyFeaturesWindow: '',
        showingAmazonLockers: false,
        showingSantanderCycles: false,

        saleTypeSelected: 'BOTH',
        saleTypeOptions: [
          { item: 'RENT', name: 'Rent' },
          { item: 'BUY', name: 'Buy' },
          { item: 'BOTH', name: 'Both'},
        ],

        propertyTypeSelected: 'ALL',
        propertyTypeOptions: [
          { item: 'FLAT', name: 'Flat' },
          { item: 'DETACHED', name: 'Detached' },
          { item: 'TERRACED', name: 'Terraced' },
          { item: 'ALL', name: 'All'},
        ],

        furnishedTypeSelected: 'ALL',
        furnishedTypeOptions: [
          { item: 'UNFURNISHED', name: 'Unfurnished' },
          { item: 'FURNISHED', name: 'Furnished' },
          { item: 'ALL', name: 'All'},
        ],

        toggledButtons: {
          amazon: false,
          santander: false
        },
        showingAdvertisement: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
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

.sorting-tab {
  max-height: 610px;
}

.nearby-place-info {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  z-index: 9999;
  padding: 10px 10px 2px 10px;
  display: inline-block;
}

h2 {
  font-size: 20px;
  font-family: 'Raleway', sans-serif;
  float: left;
  margin-right: 5px;
}

.selected-property-images {
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 5px;
  padding: 5px;
  width: 98%;
  background-color: white;
  border-radius: 5px;
  z-index: 999;
  transition: 1s;
  border: 1px solid;
}

.selected-property-features {
  position: absolute;
  bottom: 0px;
  left: 0px;
  margin: 5px;
  padding: 5px;
  width: 50%;
  height: 98%;
  background-color: white;
  border-radius: 5px;
  z-index: 999;
  transition: 1s;
  padding-left: 0px;
  border: 1px solid;
}

.selected-property-features .features {
  overflow-y: scroll;
  height: 85%;
}
.selected-property-features.mini {
  height: 50%;

}

.selected-property-images.mini {
  width: 50%;

}

.options {
  width: 100%;
  height: 20px;
  margin: 5px;
  padding-right: 10px;
  margin-bottom: 10px
}

.options svg {
  width: 20px;
  height: 20px;
  color: black;
  float: right;
  margin: 0px 5px;
}

.error-container {
  width: 60%;
}


</style>
