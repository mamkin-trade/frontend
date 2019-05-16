<template lang="pug">
  nav
    v-toolbar(flat app)
      // Title
      router-link(:to='isLoggedIn ? "/cabinet" : "/"')
        v-toolbar-title.text-uppercase.grey--text
          v-tooltip(v-if='user' bottom)
            span.hidden-xs-only(slot='activator') {{$t('title')}}
            span.hidden-sm-and-up(slot='activator') {{$t('shortTitle')}}
            span {{user.name}}, {{user.email || user.facebookId || user.telegramId}}
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
      // Logout
      div(v-if='isLoggedIn')
        v-dialog(v-model='resetDialog')
          template(v-slot:activator='{ on }')
            v-menu(offset-y)
              v-btn(flat icon color='grey' slot='activator')
                v-icon more_horiz
              v-list
                v-list-tile(@click='logout')
                  v-list-tile-title {{$t("logout")}}
                v-list-tile(v-on='on')
                  v-list-tile-title {{$t("reset")}}
          v-card
            v-card-title {{$t("resetMessage")}}
            v-card-actions.pb-3
              v-spacer
              v-btn(color='primary' @click='resetDialog = false') {{$t("cancel")}}
              v-btn(color='error' :loading='resetLoading' @click='reset') {{$t("reset")}}
              v-spacer
        
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { i18n } from "../plugins/i18n";
import * as api from "../utils/api";
import { updateUser } from "../utils/dataUpdater";

@Component
export default class Navbar extends Vue {
  resetDialog = false;
  resetLoading = false;

  get isLoggedIn() {
    return store.isLoggedIn();
  }
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
  get user() {
    return store.user();
  }

  toggleMode() {
    store.setDark(!store.dark());
  }
  changeLanguage(locale: string) {
    i18n.locale = locale;
    store.setLanguage(locale);
  }
  logout() {
    store.logout();
    this.$router.replace("/");
  }
  async reset() {
    if (!this.user) {
      return;
    }
    this.resetLoading = true;
    try {
      await api.reset(this.user);
      store.setSnackbar({
        message: "resetSuccess",
        color: "success",
        active: true
      });
      this.resetDialog = false;
      updateUser();
    } catch (err) {
      store.setSnackbar({
        message: "errors.general",
        color: "error",
        active: true
      });
    } finally {
      this.resetLoading = false;
    }
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

