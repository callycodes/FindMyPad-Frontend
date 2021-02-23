<template>
  <div id="nav">

    <b-button id="toggle-sidebar-btn" @click="toggleSidebar">Toggle Sidebar</b-button>
  <b-sidebar no-close-on-route-change=true width="400px" :visible="shown" id="nav-sidebar" title="Sidebar" no-header>
      <div id="nav-sidebar">
        <div class="nav-logo">
           <b-icon class="icon" icon="house-door" style="width: 150px; height: 150px;"></b-icon>
           <h1 class="text">UniAccom</h1>
        </div>

        <ul class="nav-list">
          <li><router-link :to="'/'">Home</router-link></li>
          <li><router-link :to="'/add'">Add Property</router-link></li>
          <li><router-link :to="'/properties'">My Properties</router-link></li>
          <li><router-link :to="'/settings'">Settings</router-link></li>
        </ul>

      </div>
      
      <template #footer>
       <div id="nav-footer" class="d-flex text-light px-3 py-2">
        
        <div class="d-flex w-100" v-if="$store.state.user">
          <b-list-group class="w-100">
      <b-list-group-item variant="dark" class="d-flex align-items-center">
        <b-avatar class="mr-3"></b-avatar>
        <span class="mr-auto">{{$store.state.user.name}}</span>
        <b-button class="w-25 mr-2" size="md" @click="logout">Logout</b-button>
      </b-list-group-item>
      </b-list-group>
        </div>

        <div class="d-flex w-100" v-else>
        <b-button class="w-25 mr-2" size="md"><router-link :to="'/login'">Login</router-link></b-button>
        <b-button class="w-25" size="md"><router-link :to="'/register'">Register</router-link></b-button>
        </div>
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
    },
    logout: function () {
      this.$store.dispatch('logoutUser')
    }
  },
  data () {
    return {
      shown: true
    }
  },
  mounted () {
    this.show();
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

.nav-list li a {
  color: var(--gainsboro);
  text-decoration: none;
}

button a {
  color: var(--gainsboro);
  text-decoration: none;
} 

.nav-list li .router-link-exact-active {
  color: var(--ming);
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