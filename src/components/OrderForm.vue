<template lang='pug'>
  v-card(flat)
    slot
    v-card-title {{$t("orderForm.title")}}
    v-form(ref='form').pa-4
      v-tooltip(right)
        v-text-field(:label='$t("pair")'
        :value='formatPair($store.state.pair)'
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
      :class='$store.state.dark ? "darken-1" : ""') {{$t("orderForm.submit")}}
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
import { isCrypto } from "../utils/isCrypto";
import { feeMultiplier } from "../utils/fee";
import { Ticker } from "../models/ticker";
import { NasdaqTicker } from "../models/nasdaqTicker";

@Component
export default class OrderForm extends Vue {
  formatPair = formatPair;

  side = "sell";
  sides = ["sell", "buy"];
  type = "market";
  types = ["limit", "market", "stop"];

  price = "";
  amount = "";

  loading = false;

  get pair() {
    return store.pair();
  }
  get firstCurrency() {
    const pair = this.pair;
    return isCrypto(pair) ? pair.substr(0, 3) : pair;
  }
  get secondCurrency() {
    const pair = this.pair;
    return isCrypto(pair) ? pair.substr(3) : "USD";
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
    const rules = [
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
    if (!isCrypto(this.pair)) {
      rules.push(
        (v: string) =>
          new Big(v || "0").mod(1).eq(0) || i18n.t("errors.integer")
      );
    }
    return rules;
  }

  // Amounts
  get total() {
    const ticker = store.currentTicker();
    let price = this.isMarket
      ? new Big(
          "lastPrice" in ticker
            ? ticker.lastPrice
            : (ticker as any).currentPrice.raw || 0
        )
      : new Big(this.price || 0);
    return isCrypto(this.pair)
      ? price
          .mul(new Big(this.amount || 0))
          .round(precision(this.secondCurrency), 0)
      : price
          .mul(new Big(this.amount || 0))
          .div(feeMultiplier(this.isMarket))
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
        this.pair,
        this.side,
        this.isMarket,
        this.isMarket ? undefined : +this.price
      ) || 0
    );
  }
  get currentPrice() {
    const ticker = store.currentTicker();
    return this.side === "buy"
      ? new Big(
          "ask" in ticker ? ticker.ask : (ticker as any).currentPrice.raw || 0
        ).toString()
      : new Big(
          "bid" in ticker ? ticker.bid : (ticker as any).currentPrice.raw || 0
        ).toString();
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

      const ticker = store.currentTicker();
      this.price = `${
        "ask" in ticker
          ? this.side === "buy"
            ? (ticker as Ticker).ask
            : (ticker as Ticker).bid
          : (ticker as NasdaqTicker).currentPrice.raw
      }`;
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
        this.pair,
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
    for (const ticker of store.store.state.nasdaqTickers) {
      if (ticker.symbol === store.store.state.pair) {
        document.title = `${ticker.currentPrice.raw} ${
          ticker.symbol
        } — ${i18n.t("strippedTitle")}`;
      }
    }
  }
}
</script>
