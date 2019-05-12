<template lang="pug">
  v-snackbar(app v-model='active', :timeout='4000', top, :color='color', flat)
    span {{text}}
    v-btn(color='white', flat, @click='active = false') {{$t('close')}}

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { i18n } from "../plugins/i18n";
import * as store from "../plugins/store";

@Component
export default class Snackbar extends Vue {
  get active() {
    return store.snackbar().active;
  }
  set active(newValue: Boolean) {
    store.hideSnackbar();
  }
  get color() {
    return store.snackbar().color;
  }
  get text() {
    return i18n.t(store.snackbar().message.toString());
  }
}
</script>

