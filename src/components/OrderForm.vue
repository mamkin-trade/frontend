<template lang='pug'>
  v-card(flat)
    slot
    v-card-title {{$t("orderForm.title")}}
    v-form(ref='form').pa-4
      v-tooltip(right)
        v-text-field(:label='$t("pair")'
        :value='formatPair(pair)'
        disabled
        slot='activator')
        span {{$t("pairTip")}}
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
      :suffix='secondCurrency'
      :rules='priceRules')
      v-text-field(:label='$t("amount")'
      v-model='amount'
      type='number'
      :hint='amountHint'
      :suffix='firstCurrency'
      :rules='amountRules')
      v-text-field(:label='$t("total")'
      :value='total'
      disabled
      type='number'
      :suffix='secondCurrency')

      v-btn.mt-2(depressed
      @click='useAll') {{$t("orderForm.useAll")}}
      v-btn.mt-2(color='primary'
      depressed
      @click='submit'
      :loading='loading'
      :disabled='loading'
      :class='isDark ? "darken-1" : ""') {{$t("orderForm.submit")}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import * as store from "../plugins/store";
import * as api from "../utils/api";
import { formatPair, formatNumber } from "../utils/format";
import { i18n } from "../plugins/i18n";
import { setTimeout } from "timers";
import { maxAvailable } from "../utils/maxAvailable";
import { Big } from "big.js";
import { minimumOrderSize, maximumOrderSize } from "../utils/orderSize";
import { precision } from "../utils/precision";
import { Watch } from "vue-property-decorator";
import { updateUser } from "../utils/dataUpdater";

@Component
export default class OrderForm extends Vue {
  formatPair = formatPair;

  side = "sell";
  sides = ["sell", "buy"];
  type = "market";
  types = ["limit", "market"];

  price = "";
  amount = "";

  loading = false;

  get pair() {
    return store.pair();
  }
  get firstCurrency() {
    return this.pair.substr(0, 3);
  }
  get secondCurrency() {
    return this.pair.substr(3);
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
  get isDark() {
    return store.dark();
  }

  // Rules
  get priceRules() {
    return [
      (v: string) =>
        new Big(v || "0").s === 1 || i18n.t("errors.greaterThanZero"),
      (v: string) =>
        !new Big(v || "0").eq(0) || i18n.t("errors.greaterThanZero"),
      (v: string) =>
        new Big(v || "0").gte(
          new Big(1).div(
            new Big(10).pow(
              precision(this.firstCurrency) + precision(this.secondCurrency)
            )
          )
        ) ||
        i18n.t("errors.greaterThanMinimumPrice", {
          minimumPrice: new Big(1)
            .div(
              new Big(10).pow(
                precision(this.firstCurrency) + precision(this.secondCurrency)
              )
            )
            .toString()
        }),
      (v: string) =>
        new Big(v || "0").lte("100000000") ||
        i18n.t("errors.lessThanMaximumPrice", {
          maximumPrice: "100000000"
        })
    ];
  }
  get amountRules() {
    return [
      (v: string) =>
        new Big(v || "0").s === 1 || i18n.t("errors.greaterThanZero"),
      (v: string) =>
        +v <= +this.maximumAmount || i18n.t("errors.insufficientFunds"),
      (v: string) =>
        new Big(v || "0").gte(minimumOrderSize(this.pair)) ||
        i18n.t("errors.minimumOrderSize", {
          minimumOrderSize: minimumOrderSize(this.pair)
        }),
      (v: string) =>
        new Big(v || "0").lte(maximumOrderSize(this.pair)) ||
        i18n.t("errors.maximumOrderSize", {
          maximumOrderSize: maximumOrderSize(this.pair)
        })
    ];
  }

  // Amounts
  get total() {
    let price = this.isMarket
      ? new Big(store.currentTicker().lastPrice || 0)
      : new Big(this.price || 0);
    return price
      .mul(new Big(this.amount || 0))
      .round(precision(this.secondCurrency), 0);
  }

  // Computed
  get amountHint() {
    return `${i18n.t("available")} ${new Big(this.maximumAmount).round(
      precision(this.pair),
      0
    )} ${this.firstCurrency}`;
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
  get currentPrice() {
    return this.side === "buy"
      ? new Big(store.currentTicker().ask || 0).toString()
      : new Big(store.currentTicker().bid || 0).toString();
  }

  @Watch("side")
  onSideChanged(val: any, oldVal: any) {
    if (val !== oldVal) {
      (this.$refs.form as any).resetValidation();
    }
  }

  @Watch("type")
  onTypeChanged(val: any, oldVal: any) {
    if (val !== oldVal) {
      (this.$refs.form as any).resetValidation();
    }
  }

  @Watch("pair")
  onPairChanged(val: any, oldVal: any) {
    if (val !== oldVal) {
      (this.$refs.form as any).resetValidation();
    }
  }

  @Watch("currentPrice")
  onCurrentPriceChanged() {
    this.updateTitleWithPrice();
  }

  mounted() {
    this.updateTitleWithPrice();
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
      updateUser();
    } catch (err) {
      store.setSnackbar({
        message: err.response.data,
        color: "error",
        active: true
      });
    } finally {
      this.loading = false;
    }
  }

  useAll() {
    this.amount = `${new Big(this.maximumAmount).round(
      precision(this.pair),
      0
    )}`;
  }

  updateTitleWithPrice() {
    for (const ticker of store.store.state.tickers) {
      if (ticker.pair === store.store.state.pair) {
        document.title = `${ticker.lastPrice} ${ticker.pair} — ${i18n.t(
          "strippedTitle"
        )}`;
      }
    }
  }
}
</script>
