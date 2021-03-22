<template>
  <div class="hello">
    <MainContent>

      <b-row no-gutters class="mb-3">

        <b-col md="12" lg="3" class="mb-3 mb-md-0">
          <b-card class="h-100 mr-0 mr-md-3">

            <div v-if="selected_property" id="more-info-container">
                <h1>{{selected_property.name}}</h1>
                <b-button @click="selected_property = null" class="back-to-sort-btn">
                  Back to Sort</b-button>
                </div>

              <div v-else id="sorting-container">
                <h1>Sort</h1>
                </div>
            </b-card>
          </b-col>

          <b-col md="12" lg="9">
      <GmapMap
  :center="{lat:study.lat, lng:study.lng}"
  :zoom="10"
  ref="googleMapsElement"
  map-id="9d791aeaba4faec3"
  style="width: 100%; height: 600px"
>

<div class="map-legend">

  </div>

<GmapMarker
    :position="{lat: study.lat, lng: study.lng}"
    :clickable="true"
    :draggable="false"
    @click="center={lat: p.latitude, lng: p.longitude}"
    
    :icon="createMarker('university')"
  />

  <GmapMarker
    :key="index"
    v-for="(p, index) in getProperties()"
    :position="{lat: p.latitude, lng: p.longitude}"
    :clickable="true"
    :draggable="false"
    @click="center={lat: p.latitude, lng: p.longitude}; setMarker(p); prioritiseProperty(index)"
    :icon="createMarker('property')"
  />

</GmapMap>

</b-col>

</b-row>


<b-list-group>
  <b-list-group-item :key="index" v-for="(p, index) in getProperties()" class="flex-column align-items-start p-3">
    
    <b-row>
      <b-col cols="2">
    <b-carousel
    class="property-carousel"
      id="image-carousel"
      v-model="slide"
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
      <b-img src="./assets/img/svg/bed.svg"></b-img>
                <span class="font-montserrat">{{p.bedrooms}}</span>
                <b-img src="./assets/img/svg/bath-tub.svg"></b-img>
                <span class="font-montserrat">{{p.bathrooms}}</span>
                <b-img src="./assets/img/svg/home.png"></b-img>
                <span class="font-montserrat">{{p.type}}</span>
    </p>

<br>
    <p class="transport-icons">
<b-img src="./assets/img/svg/bike.svg"></b-img>
                <span class="font-montserrat">{{cycling_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/pedestrian-man.svg"></b-img>
                <span class="font-montserrat">{{walking_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/steering-wheel.svg"></b-img>
                <span class="font-montserrat">{{driving_routes[index].duration.text}}</span>
                <b-img src="./assets/img/svg/train.svg"></b-img>
                <span class="font-montserrat">{{transit_routes[index].duration.text}}</span>
      </p>


</b-col>

<b-col class="property-buttons" cols="3">
<b-button squared class="w-100 font-montserrat" variant="outline-primary">View on Rightmove</b-button>
<b-button squared class="w-100 font-montserrat" @click="zoomToProperty(p, index)" variant="outline-secondary">View on Map</b-button>
<b-button squared class="w-100 font-montserrat" variant="outline-danger">Remove</b-button>
</b-col>

    </b-row>
  </b-list-group-item>

  
</b-list-group>


    </MainContent>
    
  </div>
</template>

<script>

import MainContent from '../components/layouts/MainContent'
import {gmapApi} from 'vue2-google-maps'

export default {
  components: {
    MainContent
  },
  computed: {
    google: gmapApi,
    
    
  },

  methods: {
    async toggleLikeProperty(index) {
      this.properties[index].liked = !this.properties[index].liked;
      const result = await this.updateProperty(this.properties[index]);
      const data = await result.data;
      console.log(data);
    },

    async updateProperty(property) {
      return this.axios.put("http://127.0.0.1:5000/properties/" + property.id, 
      property)
    },
    prioritiseProperty(index) {
      var temp = this.properties[0];
      this.properties[0] = this.properties[index];
      this.properties[index] = temp;
    },
    zoomToProperty(property, index) {
      this.prioritiseProperty(index);
      this.selected_property = property;
      this.$refs.googleMapsElement.panTo({lat: property.latitude,
      lng: property.longitude});
      //this.$refs.googleMapsElement.zoomTo({zoom: 15});
      this.sortPropertyList();
    },
    setMarker (index) {
      this.selected_property = index
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
    collectRoutes () {
      
        let walking_url = this.generateURL('walking')
        this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(walking_url)).then((response) => {
          for (let value of response.data.rows) {
            this.walking_routes.push(value.elements[0])
              
          }
        })

        let cycling_url = this.generateURL('bicycling')
        this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(cycling_url)).then((response) => {
          for (let value of response.data.rows) {
            this.cycling_routes.push(value.elements[0])
              
          }
        })

        let driving_url = this.generateURL('driving')
        this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(driving_url)).then((response) => {
          for (let value of response.data.rows) {
            this.driving_routes.push(value.elements[0])
              
          }
        })

        let transit_url = this.generateURL('transit')
        this.axios.get("http://127.0.0.1:5000/getroutes?url=" + encodeURIComponent(transit_url)).then((response) => {
          for (let value of response.data.rows) {
            this.transit_routes.push(value.elements[0])
              
          }
        })
      
      
    },
    createMarker (type) {
      return {
        url:
      "./assets/img/googlemaps/" + type + ".svg",
      scaledSize: {width: 32, height: 32}
    }
    },

    getProperties() {

      return this.properties;

      /*return this.properties.sort(function(a, b) {
  
  
    if (a.bedrooms > b.bedrooms) return 1;
  if (a.bedrooms == b.bedrooms) return 0
  return -1;
  
  
});*/
    }
  },
  mounted () {

      this.axios.get("http://127.0.0.1:5000/properties/user/" + this.$store.state.user.id).then((response) => {
        //console.log(response.data)
        this.properties = response.data.properties
        //console.log(response.data.properties)
        this.collectRoutes()

      })
      
  },
  data () {
    return {
      map_properties: {
        zoom: 10
      },
      study: {
        lat:51.57770945,
        lng:-0.3220826921696374
      },
      selected_property: null,
      properties: [],
      cycling_routes: [],
      walking_routes: [],
      driving_routes: [],
      transit_routes: [],
      markers: [
        {
          position: {
              lat:51.57770945, 
              lng:-0.3220826921696374
          }
        }
      ]
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
