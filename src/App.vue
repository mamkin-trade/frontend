<template lang="pug">
  v-app(:dark='isDark()' :class='isDark() ? "grey darken-4" : "grey lighten-4"')
    Navbar
    Snackbar
    v-content
      router-view
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import Snackbar from "./components/Snackbar.vue";
import * as store from "./plugins/store";

export default {
  components: { Navbar, Snackbar },
  methods: {
    isDark() {
      return store.dark();
    }
  }
};
</script>
