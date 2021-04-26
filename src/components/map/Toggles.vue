<template>
<div id="toggles">

<div class="button-container">
  <b-button @click="toggleAmazon" squared class="font-montserrat amazon-button" :variant="getVariant('amazon')"><span v-if="!toggled.amazon">Show</span><span v-else>Hide</span> Amazon Lockers</b-button>
  <b-button @click="toggleCycles" squared class="font-montserrat cycle-button" :variant="getVariant('santander')"><span v-if="!toggled.santander">Show</span><span v-else>Hide</span> Santander Bikes</b-button>
</div>
</div>
</template>

<script>

export default {
  props: ['toggled'],
  components: {
    
  },
  computed: {

  },
  methods: {

    toggleAmazon() {
      this.$emit('toggleAmazon');
    },
    toggleCycles() {
      this.$emit('toggleCycles');
    },
    getVariant(type) {
      if (type == 'amazon') {
        if (this.toggled.amazon) {
          return 'outline-warning';
        } else {
          return 'outline-light';
        }
      } else {
        if (this.toggled.santander) {
          return 'outline-danger';
        } else {
          return 'outline-light';
        }
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
#toggles {
  width: auto;
  display: inline-flex;
  position: absolute;
  bottom: 25px;
  margin-left: 6px;
  left: 0;
}

.button-container {
  margin: 2px;
  background-color: black;
  padding: 3px;
}
</style>
