<template lang='pug'>
  v-card(flat)
    slot
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
        tr(:class='props.item.completed || props.item.cancelled ? isDark ? "grey--text" : "grey--text text--darken-1" : ""')
          td(v-if='!$props.userId').pa-0.text-xs-center
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
          td {{props.item.amount}}
          td {{props.item.price}}
          td {{$t(props.item.side)}}
          td {{$t(props.item.type)}}
          td(v-if='props.item.completionDate')
            v-tooltip(bottom)
              span(slot='activator') {{$t(orderStatus(props.item))}}
              span {{formatDate(props.item.completionDate)}}
          td(v-else) {{$t(orderStatus(props.item))}}
          td
            v-tooltip(v-if='props.item.crypto' bottom)
              span(slot='activator') {{props.item.fee}}
              span {{props.item.fee ? props.item.type === "market" ? "0.2%" : "0.1%" : "0%"}}
            span(v-else) {{props.item.fee}}
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

@Component({
  props: {
    userId: String
  }
})
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

  get isDark() {
    return store.dark();
  }
  get headers() {
    const result: object[] = [
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
        text: i18n.t("orders.status"),
        value: "status",
        sortable: false
      },
      {
        text: i18n.t("orders.fee"),
        value: "fee",
        sortable: false
      }
    ];
    if (!this.$props.userId) {
      result.unshift({
        sortable: false
      });
    }
    return result;
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
    if (!user && !this.$props.userId) {
      return;
    }
    this.ordersUpdating = true;
    if (showLoading) {
      this.loading = true;
    }
    try {
      const { page, rowsPerPage } = this.pagination;
      const response = await api.getOrders(
        this.$props.userId || user,
        (page - 1) * rowsPerPage,
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
      this.orderDeleting = false;
    }
  }

  orderStatus(order: Order) {
    if (order.cancelled) {
      return "orders.cancelled";
    } else if (order.completed) {
      return "orders.completed";
    } else {
      return "orders.active";
    }
  }
}
</script>
