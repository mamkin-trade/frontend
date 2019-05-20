<template lang="pug">
  v-card
    slot
    v-card-title(flat v-if='needsTitle') {{$t("leaderboard.title")}}
    v-data-table(hide-actions :headers='headers' :items='leaderboard' :loading='!leaderboard.length' :no-data-text='$t("loading")')
      template(v-slot:items='props').text-xs-left
        td {{ props.item.index }}
        td {{ props.item.name }}
        td.text-no-wrap ${{ formatNumber(props.item.overallBalance || 0, { sig: 2 }) }}
        //- td.text-no-wrap {{ formatNumber(props.item.subCount, { sig: 0 }) }}
        td
          v-icon(small @click='open(props.item._id)') link
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber } from "../utils/format";
import { i18n } from "../plugins/i18n";
const translitRusEng = require("translit-rus-eng");
const caps = require("titlecaps");

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
      },
      {
        text: i18n.t("leaderboard.subs"),
        value: "subCount",
        sortable: false
      },
      { sortable: false }
    ];
  }

  get leaderboard() {
    return store.leaderboard().map((u, i) => {
      const userCopy = Object.assign({}, u) as any;
      userCopy.index = i + 1;
      if (i18n.locale !== "ru") {
        userCopy.name = caps.titlecaps(
          translitRusEng(userCopy.name).replace("`", "")
        );
      }
      return userCopy;
    });
  }

  open(id: string) {
    window.open(`https://mamkin.trade/user/${id}`, "_blank");
  }
}
</script>
