<template lang="pug">
  .py-2
    v-card(flat v-for='(user, index) in leaderboard' :key='index')
      v-layout(row)
        v-flex.xs2.pl-2 {{index + 1}}.
        v-flex.xs5 {{user.name}}
        v-flex.xs5 ${{formatNumber(user.overallBalance)}}
      v-divider
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber } from "../utils/format";

@Component
export default class Rating extends Vue {
  formatNumber = formatNumber;

  get leaderboard() {
    return store.leaderboard();
  }
}
</script>

