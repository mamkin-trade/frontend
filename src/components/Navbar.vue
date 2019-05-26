<template lang="pug">
  nav
    v-toolbar(flat app)
      // Dialogs
      v-dialog(v-model='resetDialog' max-width="600px")
        ResetDialog(:close='closeResetDialog')
      v-dialog(v-model='keysDialog' max-width="600px")
        KeysDialog(:close='closeKeysDialog')
      // Title
      router-link(:to='$store.state.user ? "/cabinet" : "/"')
        v-toolbar-title.text-uppercase.grey--text
          v-tooltip(v-if='$store.state.user' bottom)
            span.hidden-xs-only(slot='activator') {{$t('title')}}
            span.hidden-sm-and-up(slot='activator') {{$t('shortTitle')}}
            span {{$store.state.user.name}}, {{$store.state.user.email || $store.state.user.facebookId || $store.state.user.telegramId || $store.state.user.vkId}}
          span(v-else slot='activator') {{$t('title')}}
      v-spacer
      // Dark mode
      v-btn(flat icon color='grey' @click='toggleMode')
        v-icon(small) brightness_2
      // Language picker
      v-menu(offset-y)
        v-btn(flat icon slot='activator' color='grey') {{currentLocale.icon}}
        v-list
          v-list-tile(v-for='locale in locales' @click='changeLanguage(locale.code)')
            v-list-tile-title {{locale.icon}}
      // Menu
      div(v-if='$store.state.user')
        v-btn(v-if='$store.state.viewEditActive' flat icon color='grey' @click='toggleViewEdit')
          v-icon done
        v-menu(v-else offset-y)
          v-btn(flat icon color='grey' slot='activator')
            v-icon more_horiz
          v-list
            v-list-tile(@click='logout')
              v-list-tile-title {{$t("logout")}}
            v-list-tile(@click='toggleViewEdit')
              v-list-tile-title {{$t("view")}}
            v-list-tile(@click.stop='resetDialog = true')
              v-list-tile-title {{$t("reset")}}
            v-list-tile(@click.stop='keysDialog = true')
              v-list-tile-title {{$t("apiKeys.title")}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { i18n } from "../plugins/i18n";
import * as api from "../utils/api";
import ResetDialog from "./ResetDialog.vue";
import KeysDialog from "./KeysDialog.vue";

@Component({
  components: {
    ResetDialog,
    KeysDialog
  }
})
export default class Navbar extends Vue {
  resetDialog = false;
  keysDialog = false;

  get locales() {
    return [{ icon: "🇺🇸", code: "en" }, { icon: "🇷🇺", code: "ru" }];
  }
  get currentLocale() {
    for (const locale of this.locales) {
      if (locale.code === i18n.locale) {
        return locale;
      }
    }
  }

  toggleMode() {
    store.setDark(!store.dark());
  }
  changeLanguage(locale: string) {
    i18n.locale = locale;
    store.setLanguage(locale);
    document.title = i18n.t("strippedTitle") as string;
  }
  logout() {
    store.logout();
    this.$router.replace("/");
  }
  toggleViewEdit() {
    store.setViewEditActive(!store.viewEditActive());
  }
  closeResetDialog() {
    this.resetDialog = false;
  }
  closeKeysDialog() {
    this.keysDialog = false;
  }
}
</script>

<style>
nav a:link {
  text-decoration: none;
}

nav a:visited {
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

nav a:active {
  text-decoration: underline;
}
</style>

