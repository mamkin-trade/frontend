<template>
  <div class="rating">
      <table>
        <tr v-for="leader, index in leaders">
            <td class='rating-index'>{{index + 1}}</td>
            <td class='rating-name'>{{leader.name}}</td>
            <td class='rating-balance'>${{leader.balance}}</td> 
        </tr>
      </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'

export default Vue.extend({
  name: 'Rating',
  data () {
    return {
      leaders: []
    }
  },
  mounted() {
    axios.get('http://188.166.96.198:1338/users/leaderboard').then(res => {
      console.log(res.data)
      let temp = res.data
      //  @ts-ignore
      temp.forEach(item => {
          item.balance = item.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      })
      this.leaders = res.data
      
    })
  }
});
</script>

<style scoped lang="scss">

</style>
