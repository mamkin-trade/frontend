<template lang='pug'>
  .orders
    h3 Создание ордера
    //- button(@click="createOrder($root.$store.state.user)") lol

    div.order-form
      div
        span Пара
        span {{formatPair(pair)}}
      div
        span Количество
        input(v-model='amount')
      div
        span Сторона
        select 
          option(value='sell' v-model='side') Sell
          option(value='buy' v-model='side') Buy
      div
        span Тип 
        select Тип
          option(value='market' v-model='type') Market
          option(value='limit' v-model='type') Limit
    

      div.create-order-cont
        button.create-order(@click="createOrder($root.$store.state.user, pair, amount, side, type)") Создать ордер
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import * as store from "../store";
import { createOrder } from '../utils/api';
import { formatPair } from "../utils/format";

@Component
export default class OrderForm extends Vue {
  amount = 0
  side = 'sell'
  type = 'market'
  createOrder = createOrder
  formatPair = formatPair;

  get pair() {
    return store.pair();
  }
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
  .order-form {
    text-align: left;
    div {
      margin-bottom: 10px;
    }
    span {
      display: inline-block;
      margin-right: 10px;
      width: 30%;
    }
    select, input {
      font-size: 20px;
      width: 30%;
      padding: 5px;
    }
  }
  .create-order {
    font-family: "Comic Neue", "Comic Sans MS", sans-serif;
    text-align: center;
    color: #fff;
    font-size: 20px;
    width: 191px;
    height: 36px;
    border: solid 1px #00aded;
    background: #00aded;
  }
  .create-order-cont {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
