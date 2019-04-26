<template>
  <div class="home">
    <fb-signin-button
      :params="fbSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Facebook
  </fb-signin-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'home',
  components: {
    
  },
  data () {
    return {
      fbSignInParams: {
        scope: 'email',
        return_scopes: true
      }
    }
  },
  methods: {
    onSignInSuccess (response: Response) {
      FB.api('/me', dude => {
        console.log(`Good to see you, ${dude.name}.`)
        console.log(response)
        axios.post('http://188.166.96.198:1338/login/facebook', {accessToken: response.authResponse.accessToken}).then(res => {
          console.log(res)
        })
      })
    },
    onSignInError (error: Error) {
      console.log('OH NOES', error)
    }
  },
  mounted() {
    axios.get('http://188.166.96.198:1338/users/leaderboard').then(res => {
      console.log(res.data)
    })
  }
});
</script>
<style>
.fb-signin-button {
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style>