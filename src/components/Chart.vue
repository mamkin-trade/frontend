<template lang="pug">
  div
    v-card(flat)
      v-card-title {{$t("chart.title")}}
      TradingView(:options="tvOptions")
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import TradingView from "../components/TradingView.vue";

@Component({
  components: {
    TradingView
  }
})
export default class Home extends Vue {
  get tvOptions() {
    return {
      symbol: "BITFINEX:" + store.pair(),
      theme: store.dark() ? "dark" : "light",
      locale: store.language() || "en",
      autosize: false,
      width: 'auto',
      height: 500,
    };
  }
}
</script>
