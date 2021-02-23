<template>
  <div class="login-page">

    <ImageTitle title="Login"  />

    <MainContent>
      <b-form id="login-form" @reset="reset">

        <b-alert variant="success" :show="login_response == 'success'" >Logged user, head to Login to get started!</b-alert>
        <b-alert variant="danger" :show="login_response == 'error'" >{{response.error}}</b-alert>

      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button class="mr-2" @click="login" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
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
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      response: {
        message: '',
        error: '',
        response: ''
      },
      login_response: ''
    }
  },
  created () {
    if (this.$store.state.user) {
      this.$router.push('/')
    }
  },
  methods: {
    reset () {

    },
    async login () {
      const response = await this.axios.post("http://127.0.0.1:5000/auth/login", 
      {
        email: this.form.email,
        password: this.form.password
      })
      const data = await response.data;
      this.response = data
      this.login_response = this.response.message
      if (this.login_response == 'success') {
        this.$store.dispatch('setUser', this.response.response)
        this.$router.push('/')
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login-form {
  padding-left: 20%;
  padding-right: 20%;
}
</style>
