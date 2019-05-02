<template>
  <div class="balance">
      <h3>Портфель</h3>
      <table>
        <th class='balance-index'>Валюта</th>
        <th class='balance-name'>Цена</th>
        <tr v-for="cur in balance">
            <td class='balance-cur'>{{cur.currency}}</td>
            <td class='balance-val'>{{cur.value}}</td>
        </tr>
      </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
import store from '../store'

export default Vue.extend({
  name: 'Balance',
  data () {
    return {
        balance: new Array
    }
  },
  mounted() {
      let temp = store.state.user.balance
      let arr = new Array
      Object.keys(temp).forEach(item => {
          // @ts-ignore
          arr.push({currency: item.toUpperCase(), value: temp[item].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
      })
      this.balance = arr
  }
});
</script>

<style scoped lang="scss">
.balance {
    width: 80%;
    margin: 0 auto;
    margin-bottom: 20px;
    margin-top: 0;
    font-size: 20px;
    font-family: 'Comic Neue', 'Comic Sans MS', sans-serif;

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
    .balance-cur {
        font-weight: bold;
       
    }
    .balance-value {
        
    }
}

</style>
