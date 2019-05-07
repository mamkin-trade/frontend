<template lang="pug">
  .footer-language
    button.btn-lang(
      :class='{active: selected === 1}',
      v-on:click='$i18n.locale = "en"',
      @click='selected = 1') {{ $t('footer.languages.en') }}
    button.btn-lang(
      :class='{active: selected === 2}',
      v-on:click='$i18n.locale = "ru"',
      @click='selected = 2') {{ $t('footer.languages.ru') }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Footer extends Vue {
  selected = 2
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/footer';
</style>
