<template lang="pug">
  .balance
    h3 Портфель
    table
      tbody
        tr
          th.balance-index Валюта
          th.balance-name Цена
        tr(v-for='cur in balance')
          td.balance-cur {{cur.currency}}
          td.balance-val {{cur.value}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../store'

@Component
export default class Balance extends Vue {
  balance = new Array
  mounted() {
    let temp = store.state.user.balance
    let arr = new Array
    Object.keys(temp).forEach(item => {
      // @ts-ignore
      arr.push({currency: item.toUpperCase(), value: temp[item].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
    })
    this.balance = arr
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/balance';
</style>
