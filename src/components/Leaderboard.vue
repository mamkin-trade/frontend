<template lang="pug">
  v-card(flat)
    slot
    v-card-title(flat v-if='needsTitle') {{$t("leaderboard.title")}}
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
import { formatNumber } from "../utils/format";
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

  leaderboard = [] as User[];
  loading = true;
  pagination = {
    sortBy: null,
    descending: null
  } as {
    sortBy: string | null;
    descending: boolean | null;
  };

  get headers() {
    return leaderboardHeaders(i18n);
  }

  timer?: NodeJS.Timeout;
  mounted() {
    this.updateLeaderboard();

    this.timer = setInterval(() => {
      this.updateLeaderboard(false);
    }, 10 * 1000);
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
