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
            tr(v-for='ticker in filteredList')
              td.tickers-pair {{formatPair(ticker.pair)}}
              td.tickers-name {{ticker.lastPrice}}
              td.tickers-change(:class='getChangeDirection(ticker) ? getChangeDirection(ticker) === 1 ? "down" : "up" : "none"') {{ticker.dailyChangePerc}}%
              td.tickers-balance {{formatVolume(ticker.volume)}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../store'
import { formatVolume } from '../utils/format'
import { formatPair } from '../utils/format'
import { Ticker } from '../models/ticker'
import { getChangeDirection } from '../utils/changeDirection'

@Component
export default class Tickers extends Vue {
  search = ''
  formatVolume = formatVolume
  formatPair = formatPair
  getChangeDirection = getChangeDirection
  sortBySearch(item: Ticker) {
    const search = this.search.toUpperCase();
    if (search === '') return true;
    else return formatPair(item.pair) && formatPair(item.pair).toUpperCase().indexOf(search) > -1
  }
  get tickersList() {
    return store.getters.tickersList
  }
  get filteredList() {
    console.log('ALARMA', this.tickersList )
    return (this.tickersList.filter(this.sortBySearch))
  } 
}
</script>

<style scoped lang="scss">
@import '../assets/scss/tickers';
</style>
