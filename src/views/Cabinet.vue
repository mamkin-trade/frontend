<template lang="pug">
  .home
    .cabinet-head
      h1.cabinet-header {{ $t('title') }}
      .cabinet-balance
        span.balance-title Стоимость портфеля
        span.balance-value ${{formatNumber($root.$store.state.user.overallBalance)}} USD
      .cabinet-user
        span.user-name {{$root.$store.state.user.name}}
        span.user-email {{$root.$store.state.user.email}}
      .cabinet-logout
        span(@click='logout') Выйти
    .cont
      .cabinet-tickers
        tickers.
      .cabinet-balance
        balance. 
        OrderForm
    Orders.
    div
      h3 {{ $t('rating.title') }}
      Rating
    Footer
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Rating from "../components/Rating.vue";
import Tickers from "../components/Tickers.vue";
import Orders from "../components/Orders.vue";
import Balance from "../components/Balance.vue";
import OrderForm from "../components/OrderForm.vue";
import Footer from "../components/shared/Footer.vue";
import * as store from "../store";
import Component from "vue-class-component";
import { formatNumber } from "../utils/format";

@Component({
  components: {
    Rating,
    Footer,
    Tickers,
    Balance,
    Orders,
    OrderForm
  }
})
export default class Cabinet extends Vue {
  formatNumber = formatNumber;

  logout() {
    store.logout(store.store);
    this.$router.replace("/");
  }
}
</script>
<style lang='scss'>
@import "../assets/scss/style";

.cabinet-head {
  text-align: left;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  .cabinet-header,
  .cabinet-balance,
  .cabinet-user,
  .cabinet-logout {
    display: inline-block;
  }
  .cabinet-header {
    flex: 1 1 auto;
  }
  .cabinet-balance {
    flex: 1 1 auto;
    span {
      display: block;
      justify-content: flex-end;
    }
    .balance-value {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .cabinet-user {
    flex: 1 1 auto;
    span {
      display: block;
      justify-content: flex-end;
    }
    .user-email {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .cabinet-logout {
    cursor: pointer;
    flex: 1 1 auto;
  }
}

.cont {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .cabinet-balance,
  .cabinet-tickers {
    flex: 1 1 auto;
  }
}
</style>