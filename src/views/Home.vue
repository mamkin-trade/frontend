<template lang="pug">
  .home.pa-4
    .text-xs-center
      .headline
        span(v-html='$t("home.info")')
      .py-4
        p {{$t('home.rules.register')}}
        p {{$t('home.rules.money')}}
        p {{$t('home.rules.success')}}
      
      fb-signin-button(:params='{ scope: "email", return_scopes: true}', @success='onSignInSuccess', @error='onSignInError') {{$t('home.facebook')}}

      .headline {{ $t('home.leaderboard') }}

    Rating
    
    .caption.text-xs-center
      div(v-html='$t("home.opensource")')
      router-link(to='/privacy') {{ $t('home.privacy') }}
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Rating from "../components/Rating.vue";
import Footer from "../components/shared/Footer.vue";
import { loginFacebook } from "../utils/api";
import * as store from "../plugins/store";
import Component from "vue-class-component";

// FB object is global, declaring here for TS
declare const FB: any;

@Component({
  components: {
    Rating,
    Footer
  }
})
export default class Home extends Vue {
  onSignInSuccess(response: any) {
    FB.api("/me", async (dude: any) => {
      const user = await loginFacebook(response.authResponse.accessToken);
      store.setUser(user);
      this.$router.replace("cabinet");
    });
  }
  onSignInError(error: Error) {
    console.log(
      "Something went wrong with Facebook login, please, try again later.",
      error
    );
  }
}
</script>