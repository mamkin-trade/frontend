<template>
  <div class="tickers">
      <h3>Валютные пары</h3>
      <div class='scrollbar'>
        <input v-model="search">
        <div class='tickers-table'>
          <table>
            <th class='tickers-index'>Пара</th>
            <th class='tickers-name'>Цена</th>
            <th class='tickers-balance'>Изменение</th> 
            <th class='tickers-balance'>Объем</th> 
            <tr v-for="ticker in tickersList">
              <td class='tickers-pair'>{{formatPair(ticker.pair)}}</td>
              <td class='tickers-name'>{{ticker.lastPrice}}</td>
              <td class='tickers-change' :class="ticker.change">{{ticker.dailyChangePerc}}%</td> 
              <td class='tickers-balance'>{{formatVolume(ticker.volume)}}</td> 
            </tr>
          </table>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
import store from '../store'
import { formatVolume } from '../utils/format'
import { formatPair } from '../utils/format'

export default Vue.extend({
  name: 'Tickers',
  data () {
    return {
      search: '',
    }
  },
  mounted() {
    
  },
  methods: {
    formatVolume: formatVolume,
    formatPair: formatPair,
    sortBySearch: item => {
      const search = this.search.toUpperCase();
      if (search === '') return true;
      else return formatPair(item.pair) && formatPair(item.pair).toUpperCase().indexOf(search) > -1
    }
  },
  computed: {
    tickersList() {
      return store.getters.tickersList
    },
    filteredList: function() {
      return (this.tickersList.filter(this.sortBySearch))
    },
    
  }
});
</script>

<style scoped lang="scss">
@import '../assets/scss/tickers';
</style>
