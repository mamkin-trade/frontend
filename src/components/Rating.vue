<template>
  <div class="rating">
      <table>
        <tr v-for="leader, index in leaders">
            <td class='rating-index'>{{index + 1}}</td>
            <td class='rating-name'>{{leader.name}}</td>
            <td class='rating-balance'>${{leader.overallBalance}}</td> 
        </tr>
      </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
import store from '../store'
import api from '../utils/api'

export default Vue.extend({
  name: 'Rating',
  data () {
    return {
      leaders: []
    }
  },
  mounted() {
    api.getRating()
    
    const self = this
    setInterval(function() {
      self.leaders = store.getters.ratingList
    }, 500)
    console.log('ALARM', this.leaders)
  }
});
</script>

<style scoped lang="scss">
.rating {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 0;
  font-size: 20px;
    
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
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
  .rating-index {
    font-weight: bold;
  }
}
</style>
