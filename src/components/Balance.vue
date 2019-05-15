<template lang="pug">
  .div
    v-card(flat)
      v-card-title
        | {{$t("balance.title")}}{{$props.userId ? " — " + this.user.name : ""}}
        v-icon(small @click='open').pl-2 link
    v-data-table(:headers='headers'
    :items='balance'
    :rowsPerPageItems='rowsPerPageItems()'
    :rows-per-page-text='$t("rowsPerPageText")'
    disable-initial-sort
    :loading='userLoading')
      template(v-slot:items='props')
        td {{ props.item.currency }}
        td {{ props.item.amount }}
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
import { getUser } from "../utils/api";
import { User } from "../models/user";

@Component({
  props: {
    userId: String
  }
})
export default class Balance extends Vue {
  formatNumber = formatNumber;
  rowsPerPageItems = rowsPerPageItems;

  userLoading = false;

  user?: any = {};

  async mounted() {
    if (this.$props.userId) {
      this.userLoading = true;
      try {
        this.user = await getUser(this.$props.userId);
      } finally {
        this.userLoading = false;
      }
    }
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

  open() {
    const user = store.user();
    if (!user) {
      return;
    }
    window.open(`https://mamkin.trade/user/${user._id}`, "_blank");
  }
}
</script>