<template lang="pug">
  div
    v-card(flat)
      slot
      v-card-title
        span {{$t("balance.title")}}
        v-spacer
        v-tooltip(v-if='$store.state.userUpdated' bottom)
          v-btn(flat
          icon
          color='grey'
          @click='update'
          slot='activator')
            v-icon(small) autorenew
          span {{$t("updated")}} {{formatDate(updatedAt || $store.state.userUpdated, true)}}
        v-btn(v-else
        flat
        icon
        color='grey'
        @click='update')
          v-icon(small) autorenew
    v-data-table(:headers='headers'
    :items='balance'
    :rowsPerPageItems='rowsPerPageItems()'
    :rows-per-page-text='$t("rowsPerPageText")'
    disable-initial-sort
    :loading='userLoading')
      template(v-slot:items='props')
        tr(@click='select(props.item.currency)')
          td {{props.item.currency}}
          td {{props.item.amount}}
      template(v-slot:footer)
        tr(v-if='ordersBalance !== "0"')
          td {{$t("orders.title")}}
          td {{ordersBalance}} USD
        tr
          td(:colspan="headers.length")
            strong {{$t("balance.overall")}}: ${{overallBalance}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber, formatDate } from "../utils/format";
import { i18n } from "../plugins/i18n";
import { rowsPerPageItems } from "../utils/rowsPerPageItems";
import { getUser } from "../utils/api";
import { User } from "../models/user";
import { updateUser } from "../utils/dataUpdater";

@Component({
  props: {
    userId: String
  }
})
export default class Balance extends Vue {
  formatNumber = formatNumber;
  formatDate = formatDate;
  rowsPerPageItems = rowsPerPageItems;

  userLoading = false;

  user?: any = {};

  updatedAt: Date | null = null;

  async mounted() {
    this.getUser();
  }

  get headers() {
    return [
      { text: i18n.t("balance.currency"), value: "currency" },
      { text: i18n.t("amount"), value: "amount" }
    ];
  }

  get balance() {
    const user = this.$props.userId ? this.user : store.user();
    if (!user || !user.balance) {
      return [];
    }
    return Object.keys(user.balance)
      .map(key => {
        if (!user) {
          return undefined;
        }
        return {
          currency: key.toUpperCase(),
          amount: formatNumber(user.balance[key], { currency: key }),
          numberAmount: user.balance[key]
        };
      })
      .filter(v => !!v)
      .filter(v => v!.numberAmount > 0);
  }

  get overallBalance() {
    const user = this.$props.userId ? this.user : store.user();
    if (!user || !user.balance) {
      return formatNumber(0);
    }
    return formatNumber(user.overallBalance, { currency: "USD" });
  }

  get ordersBalance() {
    const user = this.$props.userId ? this.user : store.user();
    if (!user || !user.balance) {
      return formatNumber(0);
    }
    return formatNumber(user.ordersBalance, { currency: "USD" });
  }

  select(pair: string) {
    const upprecasePair = pair.toUpperCase();
    if (upprecasePair === "USD") {
      return;
    }
    // Check if crypto
    for (const ticker of store.tickers()) {
      if (ticker.pair === `${upprecasePair}USD`) {
        store.setTickersSelected("crypto");
        store.setPair(ticker.pair);
        return;
      }
    }
    for (const ticker of store.tickers()) {
      if (ticker.pair === `${upprecasePair}BTC`) {
        store.setTickersSelected("crypto");
        store.setPair(ticker.pair);
        return;
      }
    }
    // Check if stocks
    for (const ticker of store.nasdaqTickers()) {
      if (ticker.symbol === upprecasePair) {
        store.setTickersSelected("stocks");
        store.setPair(ticker.symbol);
        return;
      }
    }
  }

  async getUser() {
    if (this.$props.userId) {
      this.userLoading = true;
      try {
        this.user = await getUser(this.$props.userId);
      } finally {
        this.userLoading = false;
      }
    }
  }

  update() {
    if (this.$props.userId) {
      this.getUser();
      this.updatedAt = new Date();
    } else {
      updateUser();
    }
  }
}
</script>