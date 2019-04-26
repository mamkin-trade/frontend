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

  <div class="footer-language">
      <button :class="{active: selected === 1}"
              class="btn-lang" v-on:click="$i18n.locale = 'en'"
              @click="selected = 1">{{ $t('footer.languages.en') }}</button>
      <button :class="{active: selected === 2}"
              class="btn-lang " v-on:click="$i18n.locale = 'ru'"
              @click="selected = 2">{{ $t('footer.languages.ru') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Rating from '../components/Rating.vue'

export default Vue.extend({
  name: 'home',
  components: {
    Rating
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
});
</script>
<style lang='scss'>
@import '../assets/scss/style';
</style>