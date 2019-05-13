<template lang="pug">
  div
    v-card(flat v-if='needsTitle')
      v-card-title {{$t("leaderboard.title")}}
    v-data-table(hide-actions :headers='headers' :items='leaderboard' :loading='!leaderboard.length' :no-data-text='$t("loading")')
      template(v-slot:items='props')
        td {{ props.item.index }}
        td {{ props.item.name }}
        td ${{ formatNumber(props.item.overallBalance, 2) }}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber } from "../utils/format";
import { i18n } from "../plugins/i18n";

@Component({
  props: {
    needsTitle: Boolean
  }
})
export default class Leaderboard extends Vue {
  formatNumber = formatNumber;

  get headers() {
    return [
      {
        text: "#",
        value: "index",
        sortable: false
      },
      { text: i18n.t("leaderboard.name"), value: "name", sortable: false },
      {
        text: i18n.t("leaderboard.balance"),
        value: "overallBalance",
        sortable: false
      }
    ];
  }

  get leaderboard() {
    return store.leaderboard().map((u, i) => {
      const userCopy = Object.assign({}, u) as any;
      userCopy.index = i + 1;
      return userCopy;
    });
  }
}
</script>
