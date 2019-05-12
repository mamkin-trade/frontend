<template lang="pug">
  div
    v-card(flat)
      v-card-title.py-0 {{$t("tickers.title")}}
        v-spacer
        v-text-field(append-icon='search'
        :label='$t("search")'
        single-line
        v-model='search')
    v-data-table(:headers='headers'
    :items='tickers'
    :loading='!tickers.length'
    :no-data-text='$t("loading")'
    :no-results-text='$t("noResults")'
    :search='search'
    :rowsPerPageItems='rowsPerPageItems()'
    :rows-per-page-text='$t("rowsPerPageText")')
      template(v-slot:items='props')
        tr(:class='isSelected(props.item.pair) ? "blue lighten-5" : ""'
        @click='select(props.item.pair)')
          td {{formatPair(props.item.pair)}}
          td {{props.item.lastPrice}}
          td(:class='volumeClass(props.item)') {{(props.item.dailyChangePerc * 100).toFixed(2)}}%
          td
            v-tooltip(bottom)
              span(slot='activator') {{formatVolume(props.item.volume)}}
              span {{formatNumber((props.item.volume * props.item.lastPrice).toFixed(3))}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatVolume, formatNumber, formatPair } from "../utils/format";
import { Ticker } from "../models/ticker";
import { getChangeDirection, ChangeDirection } from "../utils/changeDirection";
import { i18n } from "../plugins/i18n";
import { rowsPerPageItems } from "../utils/rowsPerPageItems";

@Component
export default class Tickers extends Vue {
  formatVolume = formatVolume;
  formatPair = formatPair;
  formatNumber = formatNumber;
  rowsPerPageItems = rowsPerPageItems;

  search = "";

  get headers() {
    return [
      {
        text: i18n.t("pair"),
        value: "pair"
      },
      { text: i18n.t("price"), value: "lastPrice" },
      { text: i18n.t("tickers.change"), value: "dailyChangePerc" },
      { text: i18n.t("tickers.volume"), value: "volume" }
    ];
  }

  get tickers() {
    return store.tickers();
  }

  volumeClass(ticker: Ticker) {
    const direction = getChangeDirection(ticker);
    if (direction === ChangeDirection.up) {
      return "green--text";
    } else if (direction === ChangeDirection.down) {
      return "red--text";
    } else {
      return "";
    }
  }

  isSelected(pair: string) {
    return pair === store.pair();
  }

  select(pair: string) {
    store.setPair(pair);
  }
}
</script>