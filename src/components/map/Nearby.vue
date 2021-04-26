<template>
<div id="nearby">

  <inline-svg @click="nearby('bank')" :class="toggled['bank'] ? 'toggled' : ''" src="./assets/img/icons/bank-building.svg"></inline-svg>
      <inline-svg @click="nearby('worship')" :class="toggled['worship'] ? 'toggled' : ''" src="./assets/img/icons/pray.svg"></inline-svg>
      <inline-svg @click="nearby('bar')" :class="toggled['bar'] ? 'toggled' : ''" src="./assets/img/icons/cocktail.svg"></inline-svg>
      <inline-svg @click="nearby('cafe')" :class="toggled['cafe'] ? 'toggled' : ''" src="./assets/img/icons/coffee.svg"></inline-svg>
      <inline-svg @click="nearby('gym')" :class="toggled['gym'] ? 'toggled' : ''" src="./assets/img/icons/fitness.svg"></inline-svg>
<inline-svg @click="nearby('park')" :class="toggled['park'] ? 'toggled' : ''" src="./assets/img/icons/park.svg"></inline-svg>
      <inline-svg @click="nearby('pharmacy')" :class="toggled['pharmacy'] ? 'toggled' : ''" src="./assets/img/icons/pharmacy.svg"></inline-svg>
      <inline-svg @click="nearby('food')" :class="toggled['food'] ? 'toggled' : ''" src="./assets/img/icons/restaurant.svg"></inline-svg>
      <inline-svg @click="nearby('shops')" :class="toggled['shops'] ? 'toggled' : ''" src="./assets/img/icons/supermarket-cart-silhouette.svg"></inline-svg>
      <inline-svg @click="nearby('laundry')" :class="toggled['laundry'] ? 'toggled' : ''" src="./assets/img/icons/washing-machine.svg"></inline-svg>

</div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  props: ['toggled'],
  components: {
    InlineSvg
  },
  computed: {

  },
  methods: {

    nearby(type) {
      this.toggled[type] = !this.toggled[type];

      this.$emit('nearby', type, this.toggled[type]);
    },
    
    getFill(type) {
        if (this.toggled[type]) {
          return 'gray';
        } else {
          return 'white';
        }
    }
    

  },

  
  data() {
    return {
      
    }
  }
}
</script>

<style scoped>
#nearby {
  padding: 3px;
  background-color: black;
  height: 55%;
  max-height: 60%;
  max-width: 40px;
  position: absolute;
  right: 10px;
  top: 80px;
  clear: both;
}


svg {
  margin: 2px;
  width: 30px;
  height: 30px;
  fill: rgba(255, 255, 255, 0.7);
  transition: 0.2s;
}

svg:hover {
  width: 35px;
  height: 35px;
  margin-left: 1px;
  fill: white;
}


.toggled {
  fill: var(--ming) !important;
}

</style>
