<template lang="pug">
  v-card-title(v-if='$store.state.viewEditActive')
    v-btn(flat icon color='grey' small @click='move(false)')
      v-icon keyboard_arrow_left
    v-btn(flat icon color='grey' small @click='move(true)')
      v-icon keyboard_arrow_right
    v-btn.hidden-sm-and-down(flat icon color='grey' small @click='changeCardSize(false)')
      v-icon remove
    v-btn.hidden-sm-and-down(flat icon color='grey' small @click='changeCardSize(true)')
      v-icon add
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store";

@Component({
  props: {
    name: String
  }
})
export default class ViewControl extends Vue {
  move(forward: boolean) {
    store.moveCard(this.$props.name, forward);
  }
  changeCardSize(increment: boolean) {
    store.changeCardSize(this.$props.name, increment);
  }
}
</script>

