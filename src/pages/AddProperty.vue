<template>
  <div id="add-property-page">
    <ImageFull>
      <MainContent class="main-content">
        

        <!-- Import property card -->
        <b-card v-if="state == 'start'"
          id="search-container"
          border-variant="dark"
          
          class="text-center mt-5 mx-auto"
        >

        
          <b-container class="w-100">

            <h2 class="font-raleway">Add Property</h2>
            <span class="font-montserrat">Simple paste your Rightmove or Zoopla property URL in the box below and press Import.</span>
            <b-form class="mt-4" inline>
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

            <b-row class="mt-4">
              <b-col cols="6">
                <b-img class="mt-4 w-50" src="./assets/img/logos/rightmove.png" rounded/>
              </b-col>
              <b-col cols="6">
                <b-img class="w-50" src="./assets/img/logos/zoopla.png" rounded/>
              </b-col>
            </b-row>

          </b-container>
        </b-card>

        <!-- Found property card -->
        <b-card v-if="state == 'save'"
          id="result-container"
          border-variant="dark"
          class="text-center mx-auto m-5" 
        >

        <b-row no-gutters>
          <b-carousel
      id="image-carousel"
      v-model="slide"
      :interval="4000"
      controls
      indicators
    >

    <b-carousel-slide v-for="(image, index) in foundProperty.images" :key="index" fluid :img-src="image.url"></b-carousel-slide>

          </b-carousel>
        </b-row>

         <b-row>
   
  </b-row>
          <b-card-text class="m-3">
            <h1 class="fc-montserrat">{{foundProperty.name}}</h1>

            <b-row>
              <b-col cols="12">
                <h2 v-if="foundProperty.transaction_type == 'BUY'" class="fc-raleway">£{{foundProperty.sale_price}}</h2>
                <h2 v-else class="fc-raleway">£{{foundProperty.monthly_price}}pcm / {{foundProperty.weekly_price}}pw</h2>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="6">
                <b-button @click="goBack" width="100" class="float-right" size="lg">Go back</b-button>
              </b-col>

               <b-col cols="6">
                <b-button @click="save" class="float-left" variant="success" size="lg">Save</b-button>
              </b-col>
            </b-row>

          </b-card-text>
      
        </b-card>

        <b-card v-if="state == 'complete'"
          id="complete-container"
          border-variant="dark"
          class="text-center mx-auto" 
        >
        <h1 class="fc-montserrat">It's in!</h1>
        <span class="font-montserrat">We found the property you are interested in and imported all of its details onto the site! There is nothing else for you to do, however, you can add another property by clicking <a @click="state = 'start'; foundProperty = null;">here</a> or you can visit <a><router-link to="/properties">Your Properties</router-link></a></span>
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
      slide: null,
      state: 'start',
      foundProperty: null
    };
  },
  methods: {
    async submit() {
      this.$store.state.loading = true

      let component = 'rightmove';
      if (this.url.includes('zoopla.co.uk')) {
        component = 'zoopla'
      }

      await this.axios
        .get("http://127.0.0.1:5000/" + component + "?url=" + this.url)
        .then((response) => {
          this.$store.state.loading = false
          if (response.data.error) {
            this.$bvToast.toast(response.data.error, {
              title: `Error!`,
              variant: 'danger',
              solid: true
            })
          } else {
            console.log(response.data)
            this.foundProperty = response.data
            this.foundProperty.user_id = this.$store.state.user.id
            this.state = 'save';
          }
        });
    },
    async save () {
      const response = await this.axios.post("http://127.0.0.1:5000/properties", 
      this.foundProperty)
      const data = await response.data;
      if (data.message == 'success') {
        this.$bvToast.toast(data.response, {
          title: `Property Added!`,
          variant: 'success',
          solid: true
        })
        this.state = 'complete';

        this.$store.dispatch('sendConfetti', this.$confetti)
      } else {
        this.$bvToast.toast(data.error, {
          title: `Error!`,
          variant: 'danger',
          solid: true
        })
      }
      
    },
    goBack: function () {
      this.state = 'start';
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

#image-carousel {

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

#result-container {
  width: 60%;
}

#search-container {
  background-color: white;
  width: 60%;
}

#rightmove_input {
  width: 100%;
}

#rightmove_submit {
  width: 100%;
}

#complete-container {
  width: 60%;
  margin-top: 20%;
}

#complete-container a {
  color: blue;
}

</style>