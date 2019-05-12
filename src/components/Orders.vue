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
    :loading='loading'
    disable-initial-sort)
      template(v-slot:items='props')
        td.pa-0.text-xs-center
          v-icon(small
          v-if='!props.item.cancelled && !props.item.completed' 
          :disabled='orderDeleting'
          @click='deleteOrder(props.item)') delete
          span(v-else) —
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
        td(v-else) —
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
        sortable: false
      },
      {
        text: i18n.t("orders.created"),
        value: "createdAt",
        sortable: false
      },
      { text: i18n.t("pair"), value: "symbol", sortable: false },
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
        text: i18n.t("side"),
        value: "side",
        sortable: false
      },
      {
        text: i18n.t("type"),
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

  timer?: NodeJS.Timeout;
  mounted() {
    this.updateOrders();

    this.timer = setInterval(() => {
      this.updateOrders(false);
    }, 10 * 1000);
  }
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  @Watch("pagination")
  onPaginationChanged(val: any, oldVal: any) {
    this.updateOrders();
  }

  ordersUpdating = false;
  async updateOrders(showLoading = true) {
    if (this.ordersUpdating) {
      return;
    }
    const user = store.user();
    if (!user) {
      return;
    }
    this.ordersUpdating = true;
    if (showLoading) {
      this.loading = true;
    }
    try {
      const { page, rowsPerPage } = this.pagination;

      const response = await api.getOrders(
        user,
        page * rowsPerPage,
        rowsPerPage
      );
      this.totalOrders = response.count;
      this.orders = response.orders;
    } finally {
      this.ordersUpdating = false;
      this.loading = false;
    }
  }

  orderDeleting = false;
  async deleteOrder(order: Order) {
    if (this.orderDeleting) {
      return;
    }
    const user = store.user();
    if (!user) {
      return;
    }
    this.orderDeleting = true;
    try {
      await api.deleteOrder(user, order);
      await this.updateOrders();
      store.setSnackbar({
        message: "snackbar.orderDeleted",
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
      this.orderDeleting = true;
    }
  }
}
</script>