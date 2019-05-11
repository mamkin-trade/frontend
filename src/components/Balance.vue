<template lang="pug">
  .balance
    h3 Портфель
    table
      tbody
        tr
          th.balance-index Валюта
          th.balance-name Цена
        tr(v-for='cur in balance')
          td.balance-cur {{cur.currency}}
          td.balance-val {{cur.value}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber } from "../utils/format";

@Component
export default class Balance extends Vue {
  get balance() {
    const user = store.user();
    if (!user) {
      return [];
    }
    return Object.keys(user.balance).map(key => {
      return {
        currency: key.toUpperCase(),
        value: formatNumber(user.balance[key])
      };
    });
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/balance";
</style>
