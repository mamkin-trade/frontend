<template lang='pug'>
  v-card(flat)
    v-card-title {{$t("orderForm.title")}}
    v-form(ref='form').pa-4
      v-text-field(:label='$t("pair")'
      v-model='pair'
      disabled)
      v-select(:items='localizedSides'
      :label='$t("side")'
      v-model='side')
      v-select(:items='localizedTypes'
      :label='$t("type")'
      v-model='type')
      v-text-field(:disabled='isMarket'
      :label='$t("price")'
      v-model='isMarket ? currentPrice : price'
      type='number'
      :suffix='secondCurrency')
      v-text-field(:label='$t("amount")'
      v-model='amount'
      type='number'
      :hint='amountHint'
      :suffix='firstCurrency'
      :rules='amountRules')
      v-text-field(:label='$t("total")'
      :value='amount * (isMarket ? currentPrice : price)'
      disabled
      type='number'
      :suffix='secondCurrency')

      v-btn.mt-2(depressed
      @click='useAll') {{$t("orderForm.useAll")}}
      v-btn.mt-2(color='primary'
      depressed
      @click='submit'
      :loading='loading'
      :disabled='loading') {{$t("orderForm.submit")}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import * as store from "../plugins/store";
import * as api from "../utils/api";
import { formatPair } from "../utils/format";
import { i18n } from "../plugins/i18n";
import { setTimeout } from "timers";
import { maxAvailable } from "../utils/maxAvailable";

@Component
export default class OrderForm extends Vue {
  amount = 0;
  side = "sell";
  sides = ["sell", "buy"];
  type = "market";
  types = ["limit", "market"];
  price = "";

  loading = false;

  get pair() {
    return formatPair(store.pair());
  }
  get firstCurrency() {
    return store.pair().substr(0, 3);
  }
  get secondCurrency() {
    return store.pair().substr(3);
  }
  get localizedSides() {
    return this.sides.map(t => {
      return { text: i18n.t(t), value: t };
    });
  }
  get localizedTypes() {
    return this.types.map(t => {
      return { text: i18n.t(t), value: t };
    });
  }
  get isMarket() {
    return this.type === "market";
  }
  get currentPrice() {
    return store.currentTicker().lastPrice;
  }
  get amountHint() {
    return `${i18n.t("maximum")} ${this.maximumAmount} ${this.firstCurrency}`;
  }
  get maximumAmount() {
    return (
      maxAvailable(
        store.pair(),
        this.side,
        this.isMarket ? undefined : +this.price
      ) || 0
    );
  }
  get amountRules() {
    return [
      (v: string) => +v > 0 || i18n.t("errors.amountGreaterThanZero"),
      (v: string) =>
        +v <= this.maximumAmount || i18n.t("errors.insufficientFunds")
    ];
  }

  async submit() {
    if (!(this.$refs.form as any).validate()) {
      return;
    }
    const user = store.user();
    if (!user) {
      return;
    }
    this.loading = true;
    try {
      await api.postOrder(
        user,
        store.pair(),
        this.amount,
        this.side,
        this.type,
        this.isMarket ? undefined : +this.price
      );
      store.setSnackbar({
        message: "snackbar.orderAdded",
        color: "success",
        active: true
      });
    } catch (err) {
      store.setSnackbar({
        message: "errors.general",
        color: "error",
        active: true
      });
    } finally {
      this.loading = false;
    }
  }

  useAll() {
    this.amount = this.maximumAmount;
  }
}
</script>
