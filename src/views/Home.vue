<template lang="pug">
  .home.pa-4
    .text-xs-center
      .headline
        span(v-html='$t("home.info")')
      .py-4
        p {{$t('home.rules.register')}}
        p {{$t('home.rules.money')}}
        p {{$t('home.rules.success')}}
      
      fb-signin-button(:params='{ scope: "email", return_scopes: true}' @success='onSignInSuccess' @error='onSignInError') {{$t('home.facebook')}}

      .headline.pt-4.pb-2 {{ $t('leaderboard.title') }}

    Leaderboard.pb-4

    .caption.text-xs-center
      div(v-html='$t("home.opensource")')
      router-link(to='/privacy') {{ $t('home.privacy') }}
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Leaderboard from "../components/Leaderboard.vue";
import { loginFacebook } from "../utils/api";
import * as store from "../plugins/store";
import Component from "vue-class-component";

// FB object is global, declaring here for TS
declare const FB: any;

@Component({
  components: {
    Leaderboard
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

<style>
.fb-signin-button {
  cursor: pointer;
  display: inline-block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style>