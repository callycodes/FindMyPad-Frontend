<template>
<div id="advertisement">
  <div v-if="show.length > 0" class="background">
    <div class="exit">
      <b @click="close()">X</b>
    </div>
      <b-row no-gutters class="property-container mx-auto mt-5 w-75">
        <b-col v-for="(property, index) in show" :key="index">
          
          <b-card border-variant="dark" class="property-card text-center mx-auto" >
          
          <b-row no-gutters>
            <b-carousel id="image-carousel" :interval="4000" controls indicators>
              <b-carousel-slide v-for="(image, index2) in property.images" :key="index2" :img-src="image.url"></b-carousel-slide>
            </b-carousel>
          </b-row>

            <b-card-text class="m-3">
              <h5 class="font-raleway mb-3">{{property.name}}</h5>

              <b-row>
                <b-col class="mb-2" cols="12">
                  <inline-svg class="float-left mt-1" width="30" height="30" src="./assets/img/svg/pound-sterling.svg"></inline-svg>
                  <h2 v-if="property.transaction_type == 'BUY'" class="fc-raleway loat-left">£{{property.sale_price}}</h2>
                  <h2 v-else class="fc-raleway">£{{property.monthly_price}}pcm / {{property.weekly_price}}pw</h2>
                </b-col>
              </b-row>

<div class="property-info mb-2">
                
      
      <inline-svg src="./assets/img/svg/bed.svg"></inline-svg>
                <span class="font-montserrat mr-5">{{property.bedrooms}}</span>


                <inline-svg src="./assets/img/svg/bath-tub.svg"></inline-svg>
                <span class="font-montserrat">{{property.bathrooms}}</span>
 </div>

              <p>{{property.note}}</p>


              
        
            </b-card-text>
  <b-button class="save-btn" @click="save(index)" variant="success" size="lg" block>Import</b-button>
          </b-card>
        </b-col>
      </b-row>
  </div>
</div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  props: ['properties', 'study'],
  components: {
    InlineSvg
  },
  computed: {

  },
  async mounted () {
    //get all realtor properties
    await this.axios.get(this.serverURL + "/realtors").then((response) => {
      //console.log(response.data)
      let realtorProperties = response.data.properties

      realtorProperties.forEach(function (realtorProperty) {
        
        let exists = false;
        let addable = false;

        if (this.advertisable.filter(p => p.uid == realtorProperty.uid).length > 0) {
          exists = true;
        }
        //CHECK IF PROPERTY ALREADY IN PORTFOLIO
        this.properties.forEach(function (existingProperty) {
          if (existingProperty.uid == realtorProperty.uid) {
            exists = true;
            return;
          } else {
            let distance = this.distance(existingProperty, {lat: realtorProperty.latitude, lng: realtorProperty.longitude});
            
            //If property is close to an existing property, recommend it
            if (distance <= 1000) {
              realtorProperty.note = 'Close to your other properties'
              addable = true;
            }
          }
        }, this)

        if (!exists) {
          //See if walking distance to place of study
          let distanceToStudy = this.distance(realtorProperty, this.study);
          if (distanceToStudy <= 2000) {
            realtorProperty.note = "This property is less than 25 minutes walk to work"
            if (distanceToStudy <= 1000) {
              realtorProperty.note = "This property is less than 12 minutes walk to work"
            } else if (distanceToStudy <= 500) {
              realtorProperty.note = "This property is less than 5 minutes walk to work"
            }
            this.advertisable.push(realtorProperty)
          }
        }

        if (addable && !exists) {
          this.advertisable.push(realtorProperty)
        }

        

      }, this);
      
    })
    
    //Randomise advertisable properties, so we don't keep suggesting the same ones
    this.advertisable.sort(() => Math.random() - 0.5);

    let i = 0;
    while (i < this.advertisable.length && i < 3) {
      this.axios.post(this.serverURL + "/realtors", {id: this.advertisable[i].id, type: 'view'})
      this.show.push(this.advertisable[i])
      i++;
    }

    if (this.show.length == 0) {
      this.close();
    }
    
    
  },
  methods: {
    close() {
      this.$emit('close');
    },
  async save(index) {

      //Pull existing property from realtors db, clean up, remove id fields etc, then public as own property
      let property = this.show[index]
      this.axios.post(this.serverURL + "/realtors", {id: property.id, type: 'import'})
      property.realtor_property = false;
      property.user_id = this.$store.state.user.id
      let features = []

      property.features.forEach((feature) => {
        features.push(feature.feature)
      })

      property.features = features;

      property.stations.forEach((station) => {
        delete station.id;
        delete station.property_id;
      })

      delete property.realtor.id;
      delete property.realtor.property_id;

      property.images.forEach((image) => {
        delete image.id;
        delete image.property_id;
      })


      let response = await this.axios.post(this.serverURL + "/properties", 
      property)

      

      const data = await response.data;
      if (data.message == 'success') {
        let imported_property = await this.axios.get(this.serverURL + "/properties/" + data.id)
        this.$emit('add', imported_property.data.property);
        this.$bvToast.toast(data.response, {
          title: `Property Added!`,
          variant: 'success',
          solid: true
        })

        //Remove property from suggestions as it's advertisable
        this.show.splice(index, 1);
      } else {
        this.$bvToast.toast(data.response, {
          title: `Problem!`,
          variant: 'danger',
          solid: true
        })
      }
    },
    distance(o, s) {
      var lat = [s.lat, o.latitude]
      var lng = [s.lng, o.longitude]
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
  },

  
  data() {
    return {
      advertisable: [],
      show: []
    }
  }
}
</script>

<style scoped>

.background {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.exit {
  position: fixed;
  right: 15px;
  top: 10px;

}

.exit b {
  font-size: 40px;
  color: white;
}

.container {
  
  border-radius: 10px;
  background-color: white;

}

.property-card {
  width: 300px;
  height: 500px;
  max-width: 300px;
  max-height: 500px;
}

.carousel {
  height: 150px;
}
.carousel-item {
  max-height: 150px;
}

.save-btn {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 280px;
}

.property-info svg {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
</style>
