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
            <tr>
                <td class='tickers-index'>Пара</td>
                <td class='tickers-name'>Цена</td>
                <td class='tickers-balance'>Изменение</td> 
                <td class='tickers-balance'>Объем</td> 
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

export default Vue.extend({
  name: 'Orders',
  data () {
    return {
      orders: [],
    }
  },
  mounted() {
    
  },
  methods: {

  },
  computed: {
    
  }
});
</script>

<style scoped lang="scss">
.tickers {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
    margin-top: 0;
    font-size: 20px;
    font-family: 'Comic Neue', 'Comic Sans MS', sans-serif;
    .tickers-table {
      max-height: 50vh;
      overflow-y: scroll;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        background-color:#fff;
        width:16px
      }
      &::-webkit-scrollbar-track {
        background-color:#fff
      }
      &::-webkit-scrollbar-track:hover {
        background-color:#f4f4f4
      }
      &::-webkit-scrollbar-thumb {
        background-color:#babac0;
        border-radius:16px;
        height: 15%;
        border:5px solid #fff
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color:#a0a0a5;
        border:4px solid #f4f4f4
      }
      &::-webkit-scrollbar-button {
        display:none
      }        
    }
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    th {
      text-align: left;
      padding: 8px;
      font-family: 'Comic Neue', 'Comic Sans MS', sans-serif;
    }
    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        font-family: 'Comic Neue', 'Comic Sans MS', sans-serif;
    }
    ul {
        list-style: none
    }
    .tickers-pair {
        font-weight: bold;
    }
    .tickers-change {
      font-weight: bold;
        &.up {
          color: #38C250
        }
        &.down {
          color: #F24359
        }
    }
}
</style>
