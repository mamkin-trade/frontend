<template lang="pug">
  .v-container.pa-4
    // Dialogs
    v-dialog(v-model='keyDialog' max-width="600px")
      v-card.text-xs-center
        v-card-text
          span {{$t('home.apiKeyMessage')}}
          v-text-field(:label='$t("home.apiKey")' v-model='key')
        v-card-actions
          v-spacer
          v-btn(color='primary' @click='onKeyAuth' depressed) {{$t("home.login")}}
          v-btn(color='error' @click='keyDialog = false' depressed) {{$t("cancel")}}
          v-spacer
    v-dialog(v-model='vkDialog' max-width="600px")
      v-card.text-xs-center
        v-layout.pa-4(align-center column)
          div(id='vk_auth')
          v-btn(color='primary' @click='vkDialog = false') {{$t("cancel")}}
    // Main content
    v-layout(column justify-center align-center).text-xs-center
      v-flex(xs12 md10)
        .headline.pb-4
          span(v-html='$t("home.info")')
        p {{$t('home.rules.register')}}
        p {{$t('home.rules.money')}}
        p {{$t('home.rules.success')}}
        
      v-flex.pt-4
        vue-telegram-login(mode='callback'
        telegram-login='mamkintrade_bot'
        @callback='onTelegramAuth'
        radius='3'
        :userpic='false')
        g-signin-button(:params='{ client_id: googleClientId }'
        @success='onGoogleSignInSuccess'
        @error='onGoogleSignInError') {{$t("home.google")}}
        fb-signin-button(:params='{ scope: "email", return_scopes: true}'
        @success='onFacebookSignInSuccess'
        @error='onFacebookSignInError') {{$t('home.facebook')}}
        .vk-signin-button(@click.stop='vkDialog = true') {{$t('home.vk')}}
        .api-signin-button(@click.stop='keyDialog = true') {{$t('home.key')}}

      v-flex(xs12 sm10 md6 lg4).pt-4
        .headline.pb-2 {{ $t('leaderboard.title') }}
        Leaderboard.text-xs-left

      v-flex.pt-4
        div(v-if='!!stats') {{$t("stats", { ...stats, totalUSDTraded: formatNumber(stats.totalUSDTraded || 0, { sig: 2 }) })}}
        div(v-html='$t("support")')
        div(v-html='$t("home.opensource")')
        .caption
          router-link(to='/privacy') {{ $t('home.privacy') }}
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Leaderboard from "../components/Leaderboard.vue";
import {
  loginFacebook,
  loginTelegram,
  loginVk,
  loginGoogle,
  loginKey
} from "../utils/api";
import * as store from "../plugins/store";
import Component from "vue-class-component";
import { formatNumber } from "../utils/format";
import { i18n } from "../plugins/i18n";
const { vueTelegramLogin } = require("vue-telegram-login");

// FB object is global, declaring here for TS
declare const FB: any;

@Component({
  components: {
    Leaderboard,
    vueTelegramLogin
  }
})
export default class Home extends Vue {
  formatNumber = formatNumber;
  vkDialog = false;
  keyDialog = false;

  key = "";

  get stats() {
    return store.stats();
  }
  get googleClientId() {
    return "522764722800-5ik7k7j9ikoa2ral08h859gb2boslq72.apps.googleusercontent.com";
  }

  mounted() {
    document.title = i18n.t("strippedTitle") as string;

    (global as any).VK.init({
      apiId: 6991313
    });
    (global as any).VK.Widgets.Auth("vk_auth", {
      onAuth: this.onVkAuth
    });
  }

  onFacebookSignInSuccess(response: any) {
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
  onFacebookSignInError(error: Error) {
    store.setSnackbar({
      message: "errors.facebook",
      color: "error",
      active: true
    });
  }
  async onGoogleSignInSuccess(googleUser: any) {
    try {
      const user = await loginGoogle(googleUser.getAuthResponse().id_token);
      store.setUser(user);
      this.$router.replace("cabinet");
    } catch (err) {
      store.setSnackbar({
        message: "errors.google",
        color: "error",
        active: true
      });
    }
  }
  onGoogleSignInError(error: Error) {
    store.setSnackbar({
      message: "errors.google",
      color: "error",
      active: true
    });
  }
  async onTelegramAuth(loginInfo: any) {
    try {
      const user = await loginTelegram(loginInfo);
      store.setUser(user);
      this.$router.replace("cabinet");
    } catch (err) {
      store.setSnackbar({
        message: "errors.telegram",
        color: "error",
        active: true
      });
    }
  }
  async onVkAuth(loginInfo: any) {
    this.vkDialog = false;
    try {
      const user = await loginVk(loginInfo);
      store.setUser(user);
      this.$router.replace("cabinet");
    } catch (err) {
      store.setSnackbar({
        message: "errors.vk",
        color: "error",
        active: true
      });
    }
  }
  async onKeyAuth() {
    try {
      const user = await loginKey(this.key);
      user.key = this.key;
      store.setUser(user);
      this.$router.replace("cabinet");
    } catch (err) {
      store.setSnackbar({
        message: "errors.key",
        color: "error",
        active: true
      });
    }
  }
}
</script>

<style>
.fb-signin-button {
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #647daf;
  color: #fff;
  margin: 10px;
}
.g-signin-button {
  margin: 10px;
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #ce5658;
  color: #fff;
}
.vk-signin-button {
  margin: 10px;
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #416b9e;
  color: #fff;
}

.api-signin-button {
  margin: 10px;
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #3a3a3a;
  color: #fff;
}
</style>
