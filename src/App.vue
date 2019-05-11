<template lang="pug">
  v-app.grey.lighten-4
    navbar
    v-content
      router-view
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
