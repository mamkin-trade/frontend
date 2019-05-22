<template lang="pug">
.tickers
  v-card(flat)
    slot
    v-card-title
      v-btn(depressed small :class='$store.state.tickersSelected === "crypto" ? "primary" : ""' @click='setTickersSelected("crypto")') {{$t('tickers.crypto')}}
      v-btn(depressed small :class='$store.state.tickersSelected === "stocks" ? "primary" : ""' @click='setTickersSelected("stocks")') {{$t('tickers.stocks')}}
      v-spacer
      v-tooltip.px-2(bottom)
        v-text-field(append-icon='search'
        :label='$t("search")'
        single-line
        v-model='search'
        slot='activator')
        span {{$t($store.state.tickersSelected === 'crypto' ? "orderForm.searchHint" : "orderForm.searchStocksHint")}}
  v-data-table(v-if='$store.state.tickersSelected === "crypto"'
  :headers='cryptoHeaders'
  :items='$store.state.tickers'
  :loading='!$store.state.tickers.length'
  :no-data-text='$t("loading")'
  :no-results-text='$t("noResults")'
  :search='search'
  :rowsPerPageItems='rowsPerPageItems()'
  :rows-per-page-text='$t("rowsPerPageText")'
  disable-initial-sort
  :filter='filter'
  :custom-sort='sortCrypto')
    template(v-slot:items='props')
      tr(:class='$store.state.pair === props.item.pair ? $store.state.dark ? "blue-grey darken-2" : "blue-grey lighten-5" : ""'
      @click='setPair(props.item.pair)')
        td {{formatPair(props.item.pair)}}
        td.text-no-wrap {{formatNumber(props.item.lastPrice)}}
        td(:class='volumeClass(props.item)') {{(props.item.dailyChangePerc * 100).toFixed(2)}}%
        td.text-no-wrap
          v-tooltip(bottom)
            span(slot='activator') {{formatVolume(props.item.volume)}}
            span {{formatNumber((props.item.volume * props.item.lastPrice).toFixed(3))}}
        td.text-no-wrap {{formatNumber(props.item.ask)}}
        td.text-no-wrap {{formatNumber(props.item.bid)}}
        td.text-no-wrap {{formatNumber(subtract(props.item.ask, props.item.bid), { sig: 5 })}}
        td
          v-icon(small @click='toggleFav(props.item.pair)') {{isFavorite(props.item.pair) ? "star" : "star_border"}}
  v-data-table(v-else
  :headers='nasdaqHeaders'
  :items='$store.state.nasdaqTickers'
  :loading='!$store.state.nasdaqTickers.length'
  :no-data-text='$t("loading")'
  :no-results-text='$t("noResults")'
  :search='search'
  :rowsPerPageItems='rowsPerPageItems()'
  :rows-per-page-text='$t("rowsPerPageText")'
  disable-initial-sort
  :filter='filter'
  :custom-sort='sortNasdaq')
    template(v-slot:items='props')
      tr(:class='$store.state.pair === props.item.symbol ? $store.state.dark ? "blue-grey darken-2" : "blue-grey lighten-5" : ""'
      @click='setPair(props.item.symbol)')
        td {{props.item.symbol}}
        td {{props.item.currentPrice.fmt}}
        td {{props.item.totalCash ? props.item.totalCash.fmt : '—'}}
        td {{props.item.grossProfits ? props.item.grossProfits.fmt : '—'}}
        td
          v-icon(small @click='toggleFav(props.item.symbol)') {{isFavorite(props.item.symbol) ? "star" : "star_border"}}
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
import { Big } from "big.js";
import { Store } from "vuex";
import * as tableHeaders from "../utils/tableHeaders";
import { NasdaqTicker } from "../models/nasdaqTicker";

@Component
export default class Tickers extends Vue {
  formatVolume = formatVolume;
  formatPair = formatPair;
  formatNumber = formatNumber;
  rowsPerPageItems = rowsPerPageItems;
  setPair = store.setPair;
  setTickersSelected = store.setTickersSelected;

  search = "";

  get cryptoHeaders() {
    return tableHeaders.cryptoHeaders(i18n);
  }

  get nasdaqHeaders() {
    return tableHeaders.nasdaqHeaders(i18n);
  }

  volumeClass(ticker: Ticker) {
    const direction = getChangeDirection(ticker);
    const dark = this.$store as Store<store.State>;
    if (direction === ChangeDirection.up) {
      return `green--text text--${store.dark() ? "lighten" : "darken"}-2`;
    } else if (direction === ChangeDirection.down) {
      return `red--text text--${store.dark() ? "lighten" : "darken"}-2`;
    } else {
      return "";
    }
  }

  isFavorite(pair: string) {
    return store.favPairs().indexOf(pair) > -1;
  }

  filter(val: string, search: string) {
    const searches = search.split("/").filter(v => !!v);
    for (const search of searches) {
      if (`${val}`.toUpperCase().indexOf(search.toUpperCase()) > -1) {
        return true;
      }
    }
    return false;
  }

  sortCrypto(items: Ticker[], index: string, isDescending: boolean) {
    const favPairs = store.favPairs();
    if (index === null) {
      const favTickers = items.filter(t => favPairs.indexOf(t.pair) > -1);
      const usualTickers = items.filter(t => favPairs.indexOf(t.pair) < 0);
      return favTickers.concat(usualTickers);
    }
    return items.sort((a, b) => {
      const aFav = favPairs.indexOf(a.pair) > -1;
      const bFav = favPairs.indexOf(b.pair) > -1;
      if (aFav && !bFav) {
        return -1;
      } else if (!aFav && bFav) {
        return 1;
      } else {
        if (index === "pair") {
          return this.modifyCompare(a.pair > b.pair, isDescending);
        } else if (index === "lastPrice") {
          return this.modifyCompare(
            (a.lastPrice || 0) > (b.lastPrice || 0),
            isDescending
          );
        } else if (index === "dailyChangePerc") {
          return this.modifyCompare(
            (a.dailyChangePerc || 0) > (b.dailyChangePerc || 0),
            isDescending
          );
        } else if (index === "volume") {
          return this.modifyCompare(
            (a.volume || 0) > (b.volume || 0),
            isDescending
          );
        } else if (index === "buy") {
          return this.modifyCompare((a.ask || 0) > (b.ask || 0), isDescending);
        } else if (index === "sell") {
          return this.modifyCompare((a.bid || 0) > (b.bid || 0), isDescending);
        } else {
          return this.modifyCompare(
            (a.ask || 0) - (a.bid || 0) > (b.ask || 0) - (b.bid || 0),
            isDescending
          );
        }
      }
    });
  }

  sortNasdaq(items: NasdaqTicker[], index: string, isDescending: boolean) {
    const favPairs = store.favPairs();
    if (index === null) {
      const favTickers = items.filter(t => favPairs.indexOf(t.symbol) > -1);
      const usualTickers = items.filter(t => favPairs.indexOf(t.symbol) < 0);
      return favTickers.concat(usualTickers);
    }
    return items.sort((a, b) => {
      const aFav = favPairs.indexOf(a.symbol) > -1;
      const bFav = favPairs.indexOf(b.symbol) > -1;
      if (aFav && !bFav) {
        return -1;
      } else if (!aFav && bFav) {
        return 1;
      } else {
        if (index === "symbol") {
          return this.modifyCompare(a.symbol > b.symbol, isDescending);
        } else if (index === "lastPrice") {
          return this.modifyCompare(
            (a.currentPrice.raw || 0) > (b.currentPrice.raw || 0),
            isDescending
          );
        } else if (index === "totalCash") {
          return this.modifyCompare(
            (a.totalCash ? a.totalCash.raw : 0) >
              (b.totalCash ? b.totalCash.raw : 0),
            isDescending
          );
        } else {
          return this.modifyCompare(
            (a.grossProfits ? a.grossProfits.raw : 0) >
              (b.grossProfits ? b.grossProfits.raw : 0),
            isDescending
          );
        }
      }
    });
  }

  modifyCompare(solution: boolean, isDescending: boolean) {
    return solution ? (isDescending ? -1 : 1) : isDescending ? 1 : -1;
  }

  subtract(a: number, b: number) {
    return new Big(a).sub(b);
  }

  toggleFav(pair: string) {
    let favPairs = store.favPairs();
    if (store.favPairs().indexOf(pair) > -1) {
      favPairs = favPairs.filter(p => p !== pair);
      store.setFavPairs(favPairs);
    } else {
      favPairs.push(pair);
      store.setFavPairs(favPairs);
    }
  }
}
</script>

<style>
.tickers .v-card__title {
  padding: 0px;
}
</style>