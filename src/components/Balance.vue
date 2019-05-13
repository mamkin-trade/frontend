<template lang="pug">
  .balance
    v-card(flat)
      v-card-title {{$t("balance.title")}}
    v-data-table(:headers='headers'
    :items='balance'
    :rowsPerPageItems='rowsPerPageItems()'
    :rows-per-page-text='$t("rowsPerPageText")'
    disable-initial-sort)
      template(v-slot:items='props')
        td {{ props.item.currency }}
        td {{ formatNumber(props.item.amount) }}
      template(v-slot:footer)
        td(:colspan="headers.length")
           strong {{$t("balance.overall")}}: ${{overallBalance}}
    </template>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber } from "../utils/format";
import { i18n } from "../plugins/i18n";
import { rowsPerPageItems } from "../utils/rowsPerPageItems";

@Component
export default class Balance extends Vue {
  formatNumber = formatNumber;
  rowsPerPageItems = rowsPerPageItems;

  get headers() {
    return [
      { text: i18n.t("balance.currency"), value: "currency" },
      { text: i18n.t("amount"), value: "amount" }
    ];
  }

  get balance() {
    const user = store.user();
    if (!user) {
      return [];
    }
    return Object.keys(user.balance)
      .map(key => {
        return {
          currency: key.toUpperCase(),
          amount: formatNumber(user.balance[key], { currency: key }),
          numberAmount: user.balance[key]
        };
      })
      .filter(v => v.numberAmount > 0);
  }

  get overallBalance() {
    const user = store.user();
    if (!user) {
      return formatNumber(0);
    }
    return formatNumber(user.overallBalance, { currency: "USD" });
  }
}
</script>