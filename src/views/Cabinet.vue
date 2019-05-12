<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.py-1(xs 12)
        Balance
      v-flex.py-1(xs 12)
        Tickers
      v-flex.py-1(xs 12)
        OrderForm
      v-flex.py-1(xs 12)
        Orders
      v-flex.py-1(xs 12)
        Leaderboard(needsTitle)
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Leaderboard from "../components/Leaderboard.vue";
import Tickers from "../components/Tickers.vue";
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
