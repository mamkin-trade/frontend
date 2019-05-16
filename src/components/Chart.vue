<template lang="pug">
  v-card(flat)
    v-expansion-panel.elevation-0(flat v-model='chartExpanded')
      v-expansion-panel-content
        template(v-slot:header)
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
  get chartExpanded() {
    return store.chartExpanded()
  }
  set chartExpanded(chartExpanded: boolean) {
    store.setChartExpanded(chartExpanded)
  }
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
