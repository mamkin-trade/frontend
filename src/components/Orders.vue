<template lang='pug'>
  .tickers
    v-card(flat)
      v-card-title {{$t("orders.title")}}
    v-data-table(:headers='headers'
    :items='orders'
    :pagination.sync='pagination'
    :total-items='totalOrders'
    :no-data-text='$t("orders.noOrdersYet")'
    :rowsPerPageItems='rowsPerPageItems(false)'
    :rows-per-page-text='$t("rowsPerPageText")'
    :loading='loading')
      template(v-slot:items='props')
        td
          v-tooltip(bottom)
            span(slot='activator') {{formatShortDate(props.item.createdAt)}}
            span {{formatDate(props.item.createdAt)}}
        td {{formatPair(props.item.symbol)}}
        td {{formatNumber(props.item.amount)}}
        td {{formatNumber(props.item.price)}}
        td {{$t(props.item.side)}}
        td {{$t(props.item.type)}}
        td {{formatBool(props.item.completed)}}
        td {{formatBool(props.item.cancelled)}}
        td(v-if='props.item.completionDate')
          v-tooltip(bottom)
            span(slot='activator') {{formatShortDate(props.item.completionDate)}}
            span {{formatDate(props.item.completionDate)}}
        rd(v-else) —
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import axios from "axios";
import * as store from "../plugins/store";
import {
  formatPair,
  formatDate,
  formatBool,
  formatNumber,
  formatShortDate
} from "../utils/format";
import * as api from "../utils/api";
import { i18n } from "../plugins/i18n";
import { rowsPerPageItems } from "../utils/rowsPerPageItems";
import { Order } from "../models/order";

@Component
export default class Orders extends Vue {
  formatNumber = formatNumber;
  formatPair = formatPair;
  formatDate = formatDate;
  formatShortDate = formatShortDate;
  formatBool = formatBool;
  rowsPerPageItems = rowsPerPageItems;

  totalOrders = 0;
  orders = [] as Order[];
  loading = true;
  pagination = {} as {
    page: number;
    rowsPerPage: number;
  };

  get headers() {
    return [
      {
        text: i18n.t("orders.created"),
        value: "createdAt",
        sortable: false
      },
      { text: i18n.t("orders.pair"), value: "symbol", sortable: false },
      {
        text: i18n.t("amount"),
        value: "amount",
        sortable: false
      },
      {
        text: i18n.t("price"),
        value: "price",
        sortable: false
      },
      {
        text: i18n.t("orders.side"),
        value: "side",
        sortable: false
      },
      {
        text: i18n.t("orders.type"),
        value: "type",
        sortable: false
      },
      {
        text: i18n.t("orders.completed"),
        value: "completed",
        sortable: false
      },
      {
        text: i18n.t("orders.cancelled"),
        value: "cancelled",
        sortable: false
      },
      {
        text: i18n.t("orders.executed"),
        value: "completionDate",
        sortable: false
      }
    ];
  }

  mounted() {
    this.updateOrders();
  }

  @Watch("pagination")
  onPaginationChanged(val: any, oldVal: any) {}

  async updateOrders() {
    const user = store.user();
    if (!user) {
      return;
    }

    this.loading = true;
    const { page, rowsPerPage } = this.pagination;

    const response = await api.getOrders(user, page * rowsPerPage, rowsPerPage);
    this.totalOrders = response.count;
    this.orders = response.orders;

    this.loading = false;
  }
}
</script>