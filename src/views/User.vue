<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.pa-1(xs12 md4 lg3)
        Balance(:userId='id')
      v-flex.pa-1(xs12 md8 lg12)
        Orders(:userId='id')
    .text-xs-center.pt-4
      div(v-html='$t("support")')
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
    Balance,
    Orders
  }
})
export default class Cabinet extends Vue {
  formatNumber = formatNumber;

  get id() {
    return this.$route.params.id;
  }
}
</script>
