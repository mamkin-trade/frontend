<template lang="pug">
  .profile
    v-card(flat v-if='user')
      v-card-title
        span {{user.name}}
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

  async mounted() {
    this.user = await api.getUser(this.$props.userId);
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
}
</script>

<style>
.profile .v-card__title {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>