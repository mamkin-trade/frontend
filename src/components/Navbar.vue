<template lang="pug">
  nav
    v-toolbar(flat, app)
      // Title
      v-toolbar-title.text-uppercase.grey--text
        span {{ $t('title') }}
      v-spacer
      // Language picker
      v-menu(offset-y)
        v-btn(flat, slot='activator', color='grey', fab) {{currentLocale.icon}}
        v-list
          v-list-tile(v-for='locale in locales' @click='changeLanguage(locale.code)')
            v-list-tile-title {{locale.icon}}
      // Logout
      v-btn(flat, color='grey' v-if='isLoggedIn')
        v-icon(right) exit_to_app
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

  changeLanguage(locale: string) {
    i18n.locale = locale;
  }
}
</script>

