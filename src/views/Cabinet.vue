<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.pa-1(xs12 md4 lg3)
        OrderForm
      v-flex.pa-1(xs12 md8 lg6)
        Tickers
      v-flex.pa-1(xs12 md4 lg3)
        Balance
      v-flex.pa-1(xs12 md8 lg12)
        Orders
      v-flex.pa-1(xs12)
        Chart
      v-flex.pa-1(xs12)
        Leaderboard(needsTitle)
    .text-xs-center.pt-4
      div(v-html='$t("support")')
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Leaderboard from "../components/Leaderboard.vue";
import Tickers from "../components/Tickers.vue";
import Chart from "../components/Chart.vue";
import Orders from "../components/Orders.vue";
import Balance from "../components/Balance.vue";
import OrderForm from "../components/OrderForm.vue";
import * as store from "../plugins/store";
import Component from "vue-class-component";
import { formatNumber } from "../utils/format";

@Component({
  components: {
    Leaderboard,
    Tickers,
    Balance,
    Orders,
    Chart,
    OrderForm
  }
})
export default class Cabinet extends Vue {
  formatNumber = formatNumber;

  overallBalance() {
    const user = store.user();
    if (!user) {
      return 0;
    }
    return user.overallBalance;
  }
}
</script>
