<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.pa-1(xs12)
        Profile(:userId='$store.state.user._id')
    v-layout(row wrap)
      v-flex.pa-1(v-for='card in layout' xs12 :class='`md${card.width}`')
        OrderForm(v-if='card.name === "OrderForm"')
          ViewControls(:name='card.name')
        Tickers(v-if='card.name === "Tickers"')
          ViewControls(:name='card.name')
        Balance(v-if='card.name === "Balance"')
          ViewControls(:name='card.name')
        Orders(v-if='card.name === "Orders"')
          ViewControls(:name='card.name')
        Chart(v-if='card.name === "Chart"')
          ViewControls(:name='card.name')
        Leaderboard(v-if='card.name === "Leaderboard"' needsTitle)
          ViewControls(:name='card.name')
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
import Profile from "../components/Profile.vue";
import OrderForm from "../components/OrderForm.vue";
import ViewControls from "../components/ViewControls.vue";
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
    OrderForm,
    ViewControls,
    Profile
  }
})
export default class Cabinet extends Vue {
  formatNumber = formatNumber;

  get layout() {
    return store.layout();
  }

  overallBalance() {
    const user = store.user();
    if (!user) {
      return 0;
    }
    return user.overallBalance;
  }
}
</script>
