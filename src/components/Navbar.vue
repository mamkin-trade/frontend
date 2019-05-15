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
      v-btn(flat fab color='grey' @click='toggleMode')
        v-icon(small) brightness_2
      // Language picker
      v-menu(offset-y)
        v-btn(flat slot='activator' color='grey' fab) {{currentLocale.icon}}
        v-list
          v-list-tile(v-for='locale in locales' @click='changeLanguage(locale.code)')
            v-list-tile-title {{locale.icon}}
      // Logout
      div(v-if='isLoggedIn')
        v-btn(flat fab color='grey' @click='logout')
          v-icon exit_to_app
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { i18n } from "../plugins/i18n";

@Component
export default class Navbar extends Vue {
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
}
</script>

<style>
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:active {
  text-decoration: underline;
}
</style>

