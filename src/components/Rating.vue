<template>
  <div class="rating">
      <table>
        <tr v-for="leader, index in ratingList">
          <td class='rating-index'>{{index + 1}}</td>
          <td class='rating-name'>{{leader.name}}</td>
          <td class='rating-balance'>${{formatNumber(leader.overallBalance)}}</td> 
        </tr>
      </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
import store from '../store'
import { formatNumber } from '../utils/format'

export default Vue.extend({
  name: 'Rating',
  data () {
    return {}
  },
  methods: {
    formatNumber: formatNumber
  },
  computed: {
    ratingList() {
      return store.getters.ratingList
    }
  }
});
</script>

<style scoped lang="scss">
@import '../assets/scss/rating';
</style>
