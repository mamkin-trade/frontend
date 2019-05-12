<template lang="pug">
  v-app.grey.lighten-4
    Navbar
    Snackbar
    v-content
      router-view
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import Snackbar from "./components/Snackbar.vue";

export default {
  components: { Navbar, Snackbar }
};
</script>
