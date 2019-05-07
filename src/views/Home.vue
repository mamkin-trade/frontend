<template lang="pug">
  .home
    .land-head
      h1.land-header {{ $t('title') }}
      .land-info(v-html='$t("info")')
    .land-feats
      span {{ $t('feats.register') }}
      span {{ $t('feats.money') }}
      span {{ $t('feats.success') }}
    fb-signin-button(:params='fbSignInParams', @success='onSignInSuccess', @error='onSignInError') {{ $t('facebook') }}  
    div
      h2 {{ $t('rating.title') }}
      Rating
    .land-open
      span(v-html='$t("open")')
    .privacy-link
      router-link(to='/privacy') {{ $t('privacy') }}
    Footer
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