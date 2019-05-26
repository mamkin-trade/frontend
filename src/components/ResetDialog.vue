<template lang="pug">
  v-card
    v-card-title {{$t("resetMessage")}}
    v-card-actions.pb-3
      v-spacer
      v-btn(color='primary' @click='closeDialog') {{$t("cancel")}}
      v-btn(color='error' :loading='resetLoading' @click='reset') {{$t("reset")}}
      v-spacer
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";
import * as api from "../utils/api";
import { updateUser } from "../utils/dataUpdater";

@Component({
  props: {
    close: Function
  }
})
export default class ResetDialog extends Vue {
  resetLoading = false;

  async reset() {
    const user = store.user();
    if (!user) {
      return;
    }
    this.resetLoading = true;
    try {
      await api.reset(user);
      store.setSnackbar({
        message: "resetSuccess",
        color: "success",
        active: true
      });
      updateUser();
      this.closeDialog();
    } catch (err) {
      store.setSnackbar({
        message: "errors.general",
        color: "error",
        active: true
      });
    } finally {
      this.resetLoading = false;
    }
  }

  closeDialog() {
    this.$props.close();
  }
}
</script>
