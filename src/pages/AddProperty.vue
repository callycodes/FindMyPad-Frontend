<template>
  <div id="add-property-page">
    <ImageFull>
      <MainContent class="main-content">
        <b-button-group v-show="!foundProperty" class="import-buttons" size="lg">
          <b-button variant="info">
            <img src="assets/img/logos/rightmove.png" />
          </b-button>
          <b-button variant="purple">
            <img src="assets/img/logos/zoopla.png" />
          </b-button>
          <b-button variant="light">
            <span class="font-raleway">Manual</span>
          </b-button>
        </b-button-group>

        <b-card v-show="!foundProperty"
          id="rightmove-container"
          border-variant="light"
          class="text-center"
        >
          <b-container class="w-100">
            <b-form inline>
              <b-row class="w-100">
                <b-col cols="9">
                  <b-form-input
                    size="lg"
                    id="rightmove_input"
                    class="mr-sm-2"
                    placeholder="https://www.rightmove.co.uk/properties/89209096#/"
                    v-model="url"
                  ></b-form-input>
                </b-col>

                <b-col cols="3">
                  <b-button
                    id="rightmove_submit"
                    @click="submit"
                    size="lg"
                    variant="dark"
                    >Import</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </b-container>
        </b-card>

        <b-card v-if="foundProperty"
          id="result-container"
          border-variant="light"
          class="text-center m-5" 
        >

        <b-row no-gutters>
          <b-carousel
      id="image-carousel"
      v-model="slide"
      :interval="4000"
      controls
      indicators
    >

    <b-carousel-slide v-for="image in foundProperty.images" :key="image.order" fluid :img-src="image.url"></b-carousel-slide>

          </b-carousel>
        </b-row>

         <b-row>
   
  </b-row>
          <b-card-text class="m-3">
            <h1 class="fc-montserrat">{{foundProperty.location.display}}</h1>

            <b-row>
              <b-col cols="12">
                <h2 class="fc-raleway">{{foundProperty.prices.monthly}} / {{foundProperty.prices.weekly}}</h2>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="6">
                <b-button @click="goBack" width="100" class="float-right" size="lg">Go back</b-button>
              </b-col>

               <b-col cols="6">
                <b-button class="float-left" variant="success" size="lg">Save</b-button>
              </b-col>
            </b-row>

          </b-card-text>
      
        </b-card>


      </MainContent>
    </ImageFull>
  </div>
</template>

<script>
import ImageFull from "../components/layouts/ImageFull";
import MainContent from "../components/layouts/MainContent";

export default {
  components: {
    ImageFull,
    MainContent,
  },
  data() {
    return {
      url: "",

      foundProperty: null,
    };
  },
  methods: {
    async submit() {
      this.$store.state.loading = true
      await this.axios
        .get("http://127.0.0.1:5000/rightmove?url=" + this.url)
        .then((response) => {
          this.$store.state.loading = false
          if (response.data.error) {
            console.error('error')
          } else {
            console.log(response.data)
            this.foundProperty = response.data
          }
        });
    },
    goBack: function () {
      this.foundProperty = null
    }
  },
};
</script>

<style scoped>
#add-property-page {
  height: 100%;
  padding-top: 40%;
}

.main-content {
  text-align: center;
}

.btn-purple {
  background-color: purple;
  color: white;
}

.import-buttons {
  width: 100%;
  margin: auto;
  margin-bottom: 30px;
  margin-top: 100px;
}

.import-buttons button {
  padding: 5px;
  max-width: 33%;
}

button img {
  width: 50%;
}

#rightmove-container {
  background-color: rgba(245, 245, 245, 0.6);
}

#rightmove_input {
  width: 100%;
}

#rightmove_submit {
  width: 100%;
}
</style>