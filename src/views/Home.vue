<template lang="pug">
  .v-container.pa-4
    v-layout(row justify-space-around)
      v-flex(xs12 md10).text-xs-center
        .headline
          span(v-html='$t("home.info")')
        .py-4
          p {{$t('home.rules.register')}}
          p {{$t('home.rules.money')}}
          p {{$t('home.rules.success')}}
        
        fb-signin-button(:params='{ scope: "email", return_scopes: true}' @success='onSignInSuccess' @error='onSignInError') {{$t('home.facebook')}}

        .headline.pt-4.pb-3 {{ $t('leaderboard.title') }}
    v-layout(row justify-space-around)
      v-flex(xs12 sm10 md6 lg4)
        Leaderboard.pb-4

    .text-xs-center
      div {{$t("stats", { ...stats, totalUSDTraded: formatNumber(stats.totalUSDTraded, { sig: 2 }) })}}
      div(v-html='$t("support")')
      div(v-html='$t("home.opensource")')
      .caption
        router-link(to='/privacy') {{ $t('home.privacy') }}
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Leaderboard from "../components/Leaderboard.vue";
import { loginFacebook } from "../utils/api";
import * as store from "../plugins/store";
import Component from "vue-class-component";
import { formatNumber } from "../utils/format";

// FB object is global, declaring here for TS
declare const FB: any;

@Component({
  components: {
    Leaderboard
  }
})
export default class Home extends Vue {
  formatNumber = formatNumber;

  get stats() {
    return store.stats();
  }
  onSignInSuccess(response: any) {
    FB.api("/me", async (dude: any) => {
      try {
        const user = await loginFacebook(response.authResponse.accessToken);
        store.setUser(user);
        this.$router.replace("cabinet");
      } catch (err) {
        store.setSnackbar({
          message: "errors.facebook",
          color: "error",
          active: true
        });
      }
    });
  }
  onSignInError(error: Error) {
    store.setSnackbar({
      message: "errors.facebook",
      color: "error",
      active: true
    });
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
z