<template lang='pug'>
  .orders
    h3 Ордера
    .scrollbar
      .tickers-table
        table
          tbody
            tr
              th.tickers-index Дата
              th.tickers-name Операция
              th.tickers-balance Цена
              th.tickers-balance Количество
              th.tickers-balance Сумма
            tr
              td.tickers-index Дата
              td.tickers-name Операция
              td.tickers-balance Цена
              td.tickers-balance Количество
              td.tickers-balance Сумма
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import * as store from "../store";

@Component
export default class Orders extends Vue {
  orders = [];
}
</script>

<style scoped lang="scss">
.orders {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 0;
  font-size: 20px;
  font-family: "Comic Neue", "Comic Sans MS", sans-serif;
  .tickers-table {
    max-height: 50vh;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      background-color: #fff;
      width: 16px;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
    }
    &::-webkit-scrollbar-track:hover {
      background-color: #f4f4f4;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #babac0;
      border-radius: 16px;
      height: 15%;
      border: 5px solid #fff;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #a0a0a5;
      border: 4px solid #f4f4f4;
    }
    &::-webkit-scrollbar-button {
      display: none;
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
    font-family: "Comic Neue", "Comic Sans MS", sans-serif;
  }
  td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    font-family: "Comic Neue", "Comic Sans MS", sans-serif;
  }
  ul {
    list-style: none;
  }
  .tickers-pair {
    font-weight: bold;
  }
  .tickers-change {
    font-weight: bold;
    &.up {
      color: #38c250;
    }
    &.down {
      color: #f24359;
    }
  }
}
</style>
