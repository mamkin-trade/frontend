<template lang="pug">
  .rating
    table
      tbody
        tr(v-for='leader, index in leaderboard')
          td.rating-index {{index + 1}}
          td.rating-name {{leader.name}}
          td.rating-balance ${{formatNumber(leader.overallBalance)}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../store";
import { formatNumber } from "../utils/format";

@Component
export default class Rating extends Vue {
  formatNumber = formatNumber;

  get leaderboard() {
    return store.leaderboard();
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/rating";
</style>
