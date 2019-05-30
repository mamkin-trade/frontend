<template lang="pug">
  .profile
    v-card(flat v-if='user')
      v-card-title
        span {{position ? `${position.absoluteNumberOfUsersAbove}. ` : ''}} {{user.name}}{{position ? ` — ${$t('top')} ${position.relativeNumberOfUsersAbove}%` : ''}}
        v-btn(flat icon color='grey' @click='open')
          v-icon(small) link
        v-spacer
        v-btn(flat small @click='subscribe') {{$t('subscribe')}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../utils/api";
import { User } from "../models/user";

@Component({
  props: {
    userId: String
  }
})
export default class Profile extends Vue {
  user: User | null = null;
  position: {
    ordersCount: number;
    absoluteNumberOfUsersAbove: number;
    relativeNumberOfUsersAbove: number;
  } | null = null;

  timer?: NodeJS.Timeout;
  async mounted() {
    this.user = await api.getUser(this.$props.userId);
    await this.updateLeaderboardPosition();

    this.timer = setInterval(() => {
      this.updateLeaderboardPosition();
    }, 15 * 1000);
  }

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  subscribe() {
    if (!this.user) {
      return;
    }
    window.open(
      `https://t.me/mamkintrade_bot?start=${this.user._id}`,
      "_blank"
    );
  }

  open() {
    if (!this.user) {
      return;
    }
    window.open(`https://mamkin.trade/user/${this.user._id}`, "_blank");
  }

  leaderboardPositionUpdating = false;
  async updateLeaderboardPosition() {
    if (!this.user || this.leaderboardPositionUpdating) {
      return;
    }
    this.leaderboardPositionUpdating = true;
    try {
      const position = await api.getLeaderboardPosition(this.user._id);
      if (!position.ordersCount) {
        return;
      }
      this.position = position;
    } finally {
      this.leaderboardPositionUpdating = false;
    }
  }
}
</script>

<style>
.profile .v-card__title {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>