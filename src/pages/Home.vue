<template>
  <div class="hello">

    <ImageTitle title="Home"  />

    <MainContent>
      <h1>Welcome to FindMyPad</h1>
      <p>Using this site, you can import properties you are interested in from Rightmove and Zoopla with 1-click. Then compare them with criteria like commuting to work and nearby amenities!</p>

      <h1 class="mt-2">1. Set your place of work/study</h1>
      <b-img class="w-50 float-left" src="./assets/img/tutorial/1.png"></b-img>
      <span class="w-50 pl-2 float-right">After you create an account, head to <b>Settings</b> and set your place of study using the map.</span>
      <div class="clearfix mb-5"></div>

      <h1 class="mt-2">2. Import properties</h1>
      <b-img class="w-50 float-left" src="./assets/img/tutorial/2.png"></b-img>
      <span class="w-50 pl-2 float-right">Then head to <b>Add Property</b> and simply paste in a Rightmove or Zoopla property URL to import it!</span>
      <div class="clearfix mb-5"></div>

      <h1 class="mt-2">3. Compare properties</h1>
      <b-img class="w-50 float-left" src="./assets/img/tutorial/3.png"></b-img>
      <span class="w-50 pl-2 float-right">Compare your properties using <b>My Properties</b>, see information such as commuting times, property details and like your favourites.</span>
      <div class="clearfix mb-5"></div>

      <h1 class="mt-2">4. View it on the map, toggle nearby amenities</h1>
      <b-img class="w-50 float-left" src="./assets/img/tutorial/4.png"></b-img>
      <span class="w-50 pl-2 float-right">View a specific property in-depth, see the commuting route on the map, toggle nearby amenities, see where the nearest Amazon Locker is.</span>
      <div class="clearfix mb-5"></div>

      <h1 class="mt-2">5. View travel and distance information</h1>
      <b-img class="w-50 float-left" src="./assets/img/tutorial/5.png"></b-img>
      <span class="w-50 pl-2 float-right">See other ways you can travel to your place of work/study, walking, cycling, driving or even public transport. See in-depth directions and even commuting costs for specific methods.</span>
      <div class="clearfix mb-5"></div>

    </MainContent>
    
  </div>
</template>

<script>

import ImageTitle from '../components/layouts/ImageTitle'
import MainContent from '../components/layouts/MainContent'

export default {
  components: {
    ImageTitle,
    MainContent
  },
  methods: {
    
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
