<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.pa-1(xs12)
        Profile(:userId='$route.params.id')
    v-layout(row wrap)
      v-flex.pa-1(xs12 md4 lg3)
        Balance(:userId='$route.params.id')
      v-flex.pa-1(xs12 md8 lg9)
        Orders(:userId='$route.params.id')
    .text-xs-center.pt-4
      div(v-html='$t("support")')
</template>

<script lang="ts">
import Vue from "vue";
import Orders from "../components/Orders.vue";
import Balance from "../components/Balance.vue";
import Profile from "../components/Profile.vue";
import Component from "vue-class-component";

@Component({
  components: {
    Balance,
    Orders,
    Profile
  }
})
export default class Cabinet extends Vue {}
</script>
