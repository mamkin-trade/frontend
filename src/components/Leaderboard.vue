<template lang="pug">
  v-card(flat)
    slot
    v-card-title(flat v-if='needsTitle')
      span {{$t("leaderboard.title")}}
      v-spacer
      v-tooltip(v-if='updatedAt' bottom)
        v-btn(flat icon color='grey' @click='updateLeaderboard' slot='activator')
          v-icon(small) autorenew
        span {{$t("updated")}} {{formatDate(updatedAt, true)}}
      v-btn(v-else flat icon color='grey' @click='updateLeaderboard')
        v-icon(small) autorenew
    v-data-table(hide-actions
    :headers='headers'
    :totalItems='10'
    :items='leaderboard'
    :loading='loading'
    :pagination.sync="pagination"
    :no-data-text='$t("loading")'
    disable-initial-sort)
      template(v-slot:items='props').text-xs-left
        td {{props.index + 1}}
        td {{props.item.name}}
        td.text-no-wrap ${{formatNumber(props.item.overallBalance || 0, { sig: 2 })}}
        td.text-no-wrap {{formatNumber(props.item.subCount, { sig: 0 })}}
        td
          v-btn(flat icon color='grey' @click='open(props.item._id)')
            v-icon(small) link
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import { formatNumber, formatDate } from "../utils/format";
import { i18n } from "../plugins/i18n";
import { User } from "../models/user";
import { leaderboardHeaders } from "../utils/tableHeaders";
import { Watch } from "vue-property-decorator";
import * as api from "../utils/api";
const translitRusEng = require("translit-rus-eng");
const caps = require("titlecaps");

@Component({
  props: {
    needsTitle: Boolean
  }
})
export default class Leaderboard extends Vue {
  formatNumber = formatNumber;
  formatDate = formatDate;

  leaderboard = [] as User[];
  loading = true;
  pagination = {
    sortBy: null,
    descending: null
  } as {
    sortBy: string | null;
    descending: boolean | null;
  };

  updatedAt: Date | null = null;

  get headers() {
    return leaderboardHeaders(i18n);
  }

  timer?: NodeJS.Timeout;
  mounted() {
    this.updateLeaderboard();

    this.timer = setInterval(() => {
      this.updateLeaderboard(false);
    }, 60 * 1000);
  }
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  formatName(name: string) {
    if (i18n.locale !== "ru") {
      return caps.titlecaps(translitRusEng(name).replace("`", ""));
    }
    return name;
  }

  open(id: string) {
    window.open(`https://mamkin.trade/user/${id}`, "_blank");
  }

  leaderboardUpdating = false;
  async updateLeaderboard(showLoading = true) {
    if (this.leaderboardUpdating) {
      return;
    }
    this.leaderboardUpdating = true;
    if (showLoading) {
      this.loading = true;
    }
    try {
      let { sortBy, descending } = this.pagination;
      if (sortBy === "subCount") {
        sortBy = "subscribers";
      }
      this.leaderboard = await api.getLeaderboard(
        sortBy !== null ? sortBy : undefined,
        descending !== null ? descending : undefined
      );
      this.updatedAt = new Date();
    } finally {
      this.leaderboardUpdating = false;
      this.loading = false;
    }
  }

  @Watch("pagination")
  paginationChanged() {
    this.updateLeaderboard();
  }
}
</script>
