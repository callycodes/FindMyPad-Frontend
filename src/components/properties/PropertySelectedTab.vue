<template>
  <div id="selected-tab"> 
    <h1>{{property.name}}</h1>


    <div class="toggle-icons w-100">
      <div class="d-flex justify-content-between">
        <inline-svg @click="nearby('bank')" :class="toggled['bank'] ? 'toggled' : ''" src="./assets/img/icons/bank-building.svg"></inline-svg>
        <inline-svg @click="nearby('worship')" :class="toggled['worship'] ? 'toggled' : ''" src="./assets/img/icons/pray.svg"></inline-svg>
        <inline-svg @click="nearby('bar')" :class="toggled['bar'] ? 'toggled' : ''" src="./assets/img/icons/cocktail.svg"></inline-svg>
        <inline-svg @click="nearby('cafe')" :class="toggled['cafe'] ? 'toggled' : ''" src="./assets/img/icons/coffee.svg"></inline-svg>
        <inline-svg @click="nearby('gym')" :class="toggled['gym'] ? 'toggled' : ''" src="./assets/img/icons/fitness.svg"></inline-svg>
      </div>

      <div class="d-flex justify-content-between">
        <inline-svg @click="nearby('park')" :class="toggled['park'] ? 'toggled' : ''" src="./assets/img/icons/park.svg"></inline-svg>
        <inline-svg @click="nearby('pharmacy')" :class="toggled['pharmacy'] ? 'toggled' : ''" src="./assets/img/icons/pharmacy.svg"></inline-svg>
        <inline-svg @click="nearby('food')" :class="toggled['food'] ? 'toggled' : ''" src="./assets/img/icons/restaurant.svg"></inline-svg>
        <inline-svg @click="nearby('shops')" :class="toggled['shops'] ? 'toggled' : ''" src="./assets/img/icons/supermarket-cart-silhouette.svg"></inline-svg>
        <inline-svg @click="nearby('laundry')" :class="toggled['laundry'] ? 'toggled' : ''" src="./assets/img/icons/washing-machine.svg"></inline-svg>
      </div>

    </div>

    
                <p>Park</p>
                <p>Pharmacy</p>
                <p>Restaurant</p>
                <p>Supermarket</p>
                <p>Laundry</p>

    <b-button @click="unselect" class="back-to-sort-btn">Back to Sort</b-button>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  props: ['property'],
  components: {
    InlineSvg
  },
  computed: {
    
    
  },

  methods: {
    unselect() {
      this.$emit('unselect');
    },
    nearby(type) {
      console.log('toggled: ' + type + " current: " + this.toggled[type]);
      this.toggled[type] = !this.toggled[type];
      this.$emit('nearby', type, this.toggled[type]);
    }

  },
  data () {
    return {
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
      }
    }
  }
}

</script>

<style scoped>
#selected-tab {
  max-height: 560px;
  height: 560px;
  padding-left: 20px;
  padding-right: 20px;
}

#selected-tab h1 {
  font-size: 30px;
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

.toggle-icons svg {
  width: 30px;
  height: 30px;
  fill: gray;
}

.toggle-icons div {
  margin-bottom: 8px;
}

.toggled {
  fill: black !important;
}

</style>
