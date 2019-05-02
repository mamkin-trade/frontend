<template>
  <div class="home">
    <div class='cabinet-head'>
      <h1 class='cabinet-header'>{{ $t('title') }}</h1>
      <div class="cabinet-balance">
        <span class="balance-title">Стоимость портфеля</span>
        <span class="balance-value">${{$root.$store.state.user.formatted}} USD</span>
      </div>
      <div class="cabinet-user">
        <span class="user-name">{{$root.$store.state.user.name}}</span>
        <span class="user-email">{{$root.$store.state.user.email}}</span>
      </div>
      <div class="cabinet-logout">
        <span @click="logout">Выйти</span>
      </div>
    </div>
    
    <div class="cont">
      <div class='cabinet-tickers'>
        <Tickers/>
      </div>
      <div class='cabinet-balance'>
        <Balance/>
      </div>
    </div>

    <div>
      <h3>{{ $t('rating.title') }}</h3>
      <Rating/>
    </div>

    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Rating from '../components/Rating.vue'
import Tickers from '../components/Tickers.vue'
import Balance from '../components/Balance.vue'
import Footer from '../components/shared/Footer.vue'
import store from '../store'

export default Vue.extend({
  name: 'home',
  components: {
    Rating,
    Footer,
    Tickers,
    Balance
  },
  data () {
    return {
      lol: 2,
    }
  },
  methods: {
    logout() {
      store.commit('logout')
      this.$router.replace('/')
    }
  },
});
</script>
<style lang='scss'>
@import '../assets/scss/style';

.cabinet-head {
  text-align: left;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  .cabinet-header, .cabinet-balance, .cabinet-user, .cabinet-logout {
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
  .cabinet-balance, .cabinet-tickers {
    flex: 1 1 auto;
  }
}
</style>