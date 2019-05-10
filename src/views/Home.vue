<template lang="pug">
  .home
    .land-head
      h1.land-header {{ $t('title') }}
      .land-info(v-html='$t("info")')
    .land-feats
      span {{ $t('feats.register') }}
      span {{ $t('feats.money') }}
      span {{ $t('feats.success') }}
    fb-signin-button(:params='{ scope: "email", return_scopes: true}', @success='onSignInSuccess', @error='onSignInError') {{ $t('facebook') }}  
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
import Vue from "vue";
import axios from "axios";
import Rating from "../components/Rating.vue";
import Footer from "../components/shared/Footer.vue";
import { loginFacebook } from "../utils/api";
import * as store from "../store";
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

<style lang='scss'>
@import "../assets/scss/style";
</style>