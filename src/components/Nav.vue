<template>
  <div id="nav">

    <b-button id="toggle-sidebar-btn" @click="toggleSidebar">Toggle Sidebar</b-button>
  <b-sidebar width="400px" :visible="shown" id="nav-sidebar" title="Sidebar" no-header>
      <div id="nav-sidebar">
        <div class="nav-logo">
           <b-icon class="icon" icon="house-door" style="width: 150px; height: 150px;"></b-icon>
           <h1 class="text">UniAccom</h1>
        </div>

        <ul class="nav-list">
          <li>Home</li>
          <li>Add Property</li>
          <li>My Properties</li>
          <li>Settings</li>
        </ul>

      </div>
      
      <template #footer>
       <div id="nav-footer" class="d-flex text-light px-3 py-2">
        
        <b-button class="w-25 mr-2" size="md">Login</b-button>
        <b-button class="w-25" size="md">Register</b-button>
       </div>
      </template>
    </b-sidebar>
</div>
</template>

<script>
export default {
  methods: {
    show: function() {
      this.shown = true;
      console.log('Shown');
    },
    hide: function() {
      this.shown = false;
      console.log('Hidden');
    },
    toggleSidebar: function() {
      this.shown = !this.shown;
      console.log('Toggled');
    }
  },
  data () {
    return {
      shown: true
    }
  }
}
</script>

<style scoped>

#nav {
  
}

.nav-logo {
  width: 100%;
  height: 300px;
  text-align: center;
}

.nav-logo .text {
  font-family: 'Raleway', sans-serif;
  color: var(--white);
}

#nav-footer {
  background-color: VAR(--jet);
}

.nav-logo .icon {
  color: var(--ming);
}

.nav-list {
  width: 100%;
  height: auto;
  list-style-type:none;
}

.nav-list li {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  margin-left: 10px;
  font-size: 25px;
  padding-bottom: 10px;
  color: var(--gainsboro);
  height: auto;
  transition: transform 1s;
}


.nav-list li:hover {
  transform: scale(1.1);
  
  color: var(--gainsboro);
}

#nav-sidebar {
  height: 100%;
  background-color: VAR(--jet);
  padding: 30px 10px 0px 10px;
}

#toggle-sidebar-btn {
  display: none;
  position: fixed;
  top: 0px;
  right: 0px;
}

@media (max-width: 1200px) {
  #toggle-sidebar-btn {
    display: block;
  }
}


</style>