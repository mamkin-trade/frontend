<template>
  <div class="home">
    <div class='land-head'>
      <h1 class='land-header'>{{ $t('title') }}</h1>
      <div class='land-info' v-html="$t('info')"></div>
    </div>
    <div class='land-feats'> 
        <span>{{ $t('feats.register') }}</span>
        <span>{{ $t('feats.money') }}</span>
        <span>{{ $t('feats.success') }}</span>
    </div>
    <fb-signin-button
      :params="fbSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      {{ $t('facebook') }}
    </fb-signin-button>

    <div>
      <h2>{{ $t('rating.title') }}</h2>
      <rating></rating>
    </div>

    <div class='land-open'>
      <span v-html="$t('open')"></span>
    </div>

    <div class="privacy-link">
      <router-link class="" to="/privacy">{{ $t('privacy') }}</router-link>
    </div>

    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Rating from '../components/Rating.vue'
import Footer from '../components/shared/Footer.vue'
import store from '../store'

export default Vue.extend({
  name: 'home',
  components: {
    Rating,
    Footer
  },
  data () {
    return {
      selected: 2,
      fbSignInParams: {
        scope: 'email',
        return_scopes: true
      }
    }
  },
  methods: {
    onSignInSuccess (response: Response) {
      //  @ts-ignore
      FB.api('/me', dude => {
        console.log(`Good to see you, ${dude.name}.`)
        console.log(response)
        //  @ts-ignore
        axios.post('https://backend.mamkin.trade/login/facebook', {accessToken: response.authResponse.accessToken}).then(res => {
          console.log(res)
          const user = res.data
          store.commit('setUser', user)
          this.$router.replace('cabinet')
        })
      })
    },
    onSignInError (error: Error) {
      console.log('OH NOES', error)
    }
  },
});
</script>
<style lang='scss'>
@import '../assets/scss/style';
</style>