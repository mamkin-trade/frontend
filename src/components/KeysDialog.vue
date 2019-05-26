<template lang="pug">
  v-card
    v-card-title
      span(v-html='$t("apiKeys.message")')
    v-card-text
      v-data-table(:items='keys'
      hide-actions
      hide-headers
      :loading='keysLoading'
      :no-data-text='$t("apiKeys.noKeysYet")')
        template(v-slot:items='props')
          td {{props.item}}
          td
            v-btn(flat icon color='grey' @click='deleteKey(props.item)' :disabled='keyDeleting')
              v-icon(small) delete
    v-card-actions.pb-3
      v-spacer
      v-btn(color='primary' @click='closeDialog') {{$t("close")}}
      v-btn(color='primary' @click='updateKeys' :loading='keysLoading') {{$t("apiKeys.refresh")}}
      v-btn(color='primary' @click='addKey' :loading='keyAdding') {{$t("apiKeys.create")}}
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
export default class KeysDialog extends Vue {
  keysLoading = false;
  keyAdding = false;
  keyDeleting = false;
  keys: string[] = [];

  closeDialog() {
    this.$props.close();
  }
  async addKey() {
    const user = store.user();
    if (!user) {
      return;
    }
    if (this.keyAdding) {
      return;
    }
    this.keyAdding = true;
    try {
      await api.addKey(user);
      await this.updateKeys();
    } catch (err) {
      store.setSnackbar({
        message: err.response.data,
        color: "error",
        active: true
      });
    } finally {
      this.keyAdding = false;
    }
  }
  async deleteKey(key: string) {
    const user = store.user();
    if (!user) {
      return;
    }
    if (this.keyDeleting) {
      return;
    }
    this.keyDeleting = true;
    try {
      await api.deleteKey(user, key);
      await this.updateKeys();
    } finally {
      this.keyDeleting = false;
    }
  }
  async updateKeys() {
    const user = store.user();
    if (!user) {
      return;
    }
    if (this.keysLoading) {
      return;
    }
    this.keysLoading = true;
    try {
      this.keys = await api.getKeys(user);
    } finally {
      this.keysLoading = false;
    }
  }
}
</script>
