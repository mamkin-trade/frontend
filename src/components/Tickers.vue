<template lang="pug">
  v-card(flat)
    slot
    v-card-title.py-0 {{$t("tickers.title")}}
      v-spacer
      v-tooltip(bottom)
        v-text-field(append-icon='search'
        :label='$t("search")'
        single-line
        v-model='search'
        slot='activator')
        span {{$t("orderForm.searchHint")}}
    v-data-table(:headers='headers'
    :items='tickers'
    :loading='!tickers.length'
    :no-data-text='$t("loading")'
    :no-results-text='$t("noResults")'
    :search='search'
    :rowsPerPageItems='rowsPerPageItems()'
    :rows-per-page-text='$t("rowsPerPageText")'
    disable-initial-sort
    :filter='filter'
    :custom-sort='sort')
      template(v-slot:items='props')
        tr(:class='isSelected(props.item.pair) ? isDark ? "blue-grey darken-2" : "blue-grey lighten-5" : ""'
        @click='select(props.item.pair)')
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
      { text: i18n.t("tickers.volume"), value: "volume" },
      { text: i18n.t("tickers.buy"), value: "buy" },
      { text: i18n.t("tickers.sell"), value: "sell" },
      { text: i18n.t("tickers.spread"), value: "spread" },
      {
        sortable: false
      }
    ];
  }

  get tickers() {
    return store.tickers();
  }

  get isDark() {
    return store.dark();
  }

  volumeClass(ticker: Ticker) {
    const direction = getChangeDirection(ticker);
    if (direction === ChangeDirection.up) {
      return this.isDark
        ? "green--text text--lighten-2"
        : "green--text text--darken-2";
    } else if (direction === ChangeDirection.down) {
      return this.isDark
        ? "red--text text--lighten-2"
        : "red--text text--darken-2";
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

  isFavorite(pair: string) {
    return store.favPairs().indexOf(pair) > -1;
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

  filter(val: string, search: string) {
    const searches = search.split("/").filter(v => !!v);
    for (const search of searches) {
      if (`${val}`.toUpperCase().indexOf(search.toUpperCase()) > -1) {
        return true;
      }
    }
    return false;
  }

  sort(items: Ticker[], index: string, isDescending: boolean) {
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
          return a.pair > b.pair
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else if (index === "lastPrice") {
          return (a.lastPrice || 0) > (b.lastPrice || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else if (index === "dailyChangePerc") {
          return (a.dailyChangePerc || 0) > (b.dailyChangePerc || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else if (index === "volume") {
          return (a.volume || 0) > (b.volume || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else if (index === "buy") {
          return (a.ask || 0) > (b.ask || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else if (index === "sell") {
          return (a.bid || 0) > (b.bid || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        } else {
          return (a.ask || 0) - (a.bid || 0) > (b.ask || 0) - (b.bid || 0)
            ? isDescending
              ? -1
              : 1
            : isDescending
            ? 1
            : -1;
        }
      }
    });
  }

  subtract(a: number, b: number) {
    return new Big(a).sub(b);
  }
}
</script>
