<template>
  <div id="nav">

    <b-button id="toggle-sidebar-btn" @click="toggleSidebar">Toggle Sidebar</b-button>
  <b-sidebar :no-close-on-route-change="true" width="300px" :visible="shown" id="nav-sidebar" title="Sidebar" no-header>
      <div id="nav-sidebar">
        <div class="nav-logo">
           <b-icon class="icon" icon="house-door" style="width: 150px; height: 150px;"></b-icon>
           <h1 class="text">FindMyPad</h1>
        </div>

        <ul class="nav-list">
          <li v-for="link in getNavLinks()" :key="link.name">
            <router-link :to="link.path">{{link.name}}</router-link>
          </li>
        </ul>

      </div>
      
      <template #footer>
       <div id="nav-footer" class="d-flex text-light px-3 py-2">
        
        <div class="d-flex w-100" v-if="$store.state.user">
          <b-list-group class="w-100">
      <b-list-group-item style="background-color: gray" border-variant="dark" class="d-flex align-items-center">
        <b-avatar variant="dark" class="mr-3"></b-avatar>
        <span class="mr-auto font-raleway">{{$store.state.user.name}}</span>
        <b-button variant="dark" size="md" @click="logout">Logout</b-button>
      </b-list-group-item>
      </b-list-group>
        </div>

        <div class="d-flex w-100" v-else>
        <b-button class="w-50 mr-2" variant="dark" size="md"><router-link :to="'/login'">Login</router-link></b-button>
        <b-button class="w-50" size="md"><router-link :to="'/register'">Register</router-link></b-button>
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
    },
    getNavLinks() {
      let links = []
      this.links.forEach((link) => {
        if (link.role.length == 0) {
          links.push(link);
        } else {
          if (this.$store.state.user) {
            if (link.role.includes(this.$store.state.user.role)) {
              links.push(link);
            }
          }
        }
      })
      return links;
    }
  },
  data () {
    return {
      shown: true,

      links: [
        {
          path: '/',
          name: 'Home',
          role: []
        },
        {
          path: '/add',
          name: 'Add Property',
          role: ['student', 'realtor']
        },
        {
          path: '/properties',
          name: 'My Properties',
          role: ['student']
        },
        {
          path: '/portfolio',
          name: 'Portfolio',
          role: ['realtor']
        },
        {
          path: '/settings',
          name: 'Settings',
          role: ['student']
        }
      ]
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