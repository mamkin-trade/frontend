<template lang="pug">
  .tickers
    h3 Валютные пары
    .scrollbar
      input(v-model='search')
      .tickers-table
        table
          tbody
            tr
              th.tickers-index Пара
              th.tickers-name Цена
              th.tickers-balance Изменение
              th.tickers-balance Объем
            tr(v-for='ticker in filteredTickers' @click='setPair(ticker.pair)' :class='{active: pair === ticker.pair}')
              td.tickers-pair {{formatPair(ticker.pair)}}
              td.tickers-name {{ticker.lastPrice}}
              td.tickers-change(:class='getChangeDirection(ticker)') {{ticker.dailyChangePerc}}%
              td.tickers-balance {{formatVolume(ticker.volume)}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatVolume } from "../utils/format";
import { formatPair } from "../utils/format";
import { Ticker } from "../models/ticker";
import { getChangeDirection } from "../utils/changeDirection";

@Component
export default class Tickers extends Vue {
  formatVolume = formatVolume;
  formatPair = formatPair;
  getChangeDirection = getChangeDirection;
  setPair = store.setPair;

  search = "";

  get tickers() {
    return store.tickers();
  }
  get pair() {
    return store.pair();
  }
  get filteredTickers() {
    return this.tickers.filter(
      ticker =>
        !this.search ||
        formatPair(ticker.pair).indexOf(this.search.toUpperCase()) > -1
    );
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/tickers";
</style>
