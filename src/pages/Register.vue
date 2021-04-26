<template>
  <div class="register-page">

    <ImageTitle title="Register"  />

    <MainContent>
      <b-form id="register-form" @reset="reset">

        <b-alert variant="success" :show="register_response == 'success'" >Registered user, head to Login to get started!</b-alert>
        <b-alert variant="danger" :show="register_response == 'error'" >{{response.error}}</b-alert>

      <b-form-group id="input-group-1" label="Your Name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Email address:"
        label-for="input-2"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-2"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Your Password:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Your Role:" label-for="selector">
      <b-form-select class="mb-3" v-model="selectedRole" :options="options"></b-form-select>
      </b-form-group>

      <b-button class="mr-2" @click="register" variant="primary">Register</b-button>
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
        name: '',
        password: ''
      },
      response: {
        message: '',
        error: '',
        response: ''
      },
      register_response: '',

      selectedRole: 'student',
        options: [
          { value: 'student', text: 'Student/Working/Other' },
          { value: 'realtor', text: 'Realtor' },
        ]

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
    async register () {
      const bcrypt = require('bcryptjs')
      const hash = await bcrypt.hash(this.form.password, 6) 
      const response = await this.axios.post(this.serverURL + "/auth/register", 
      {
        email: this.form.email,
        name: this.form.name,
        password_hash: hash,
        role: this.selectedRole
      })
      const data = await response.data;
      this.response = data
      this.register_response = this.response.message
      if (this.register_response == 'success') {
        this.form.email = this.form.name = this.form.password = ""
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#register-form {
  padding-left: 20%;
  padding-right: 20%;
}
</style>
