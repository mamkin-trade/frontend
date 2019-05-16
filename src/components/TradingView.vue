<template lang="pug">
  div(id='tradingview-container')
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

declare global {
  interface Window {
    TradingView: {
      widget: {
        new (options: object): any;
      };
    };
  }
}

@Component({
  props: { options: Object },
  watch: {
    options: {
      deep: true,
      handler: "optionsChanged"
    } as any
  }
})
export default class TradingView extends Vue {
  options: any;
  widget: any;

  createWidget() {
    const options = {
      ...this.options,
      container_id: "tradingview-container"
    };
    this.widget = new window.TradingView.widget(options);
  }

  mounted() {
    this.createWidget();
  }

  optionsChanged(newVal: any, oldVal: any) {
    if (this.widget) {
      this.widget.remove();
      this.createWidget();
    }
  }

  destroyed() {
    if (this.widget) {
      this.widget.remove();
      this.widget = undefined;
    }
  }
}
</script>
