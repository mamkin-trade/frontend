<template>
  <div class="footer-language">
    <button 
        :class="{active: selected === 1}"
        class="btn-lang" v-on:click="$i18n.locale = 'en'"
        @click="selected = 1">{{ $t('footer.languages.en') }}</button>
    <button 
        :class="{active: selected === 2}"
        class="btn-lang " v-on:click="$i18n.locale = 'ru'"
        @click="selected = 2">{{ $t('footer.languages.ru') }}</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
  data () {
    return {
      selected: 2,
    }
  },
});
</script>

<style scoped lang="scss">
.btn-lang {
    background: 0 0;
    border: 0;
    color: #6e717f;
    cursor: pointer;
    display: inline-block;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0;
    outline: 0;
    padding: 3px 5px;
    position: relative;
    transition: all .2s ease;
    transform: translate3d(0,0,0);
  
    &:after {
      background: #6e717f;
      bottom: 0;
      content: '';
      height: 1px;
      left: 50%;
      position: absolute;
      width: 0;
      transition: width .2s ease,left .2s ease;
    }
    &.active {
      color: #6e717f;
      cursor: default;
      font-size: 18px;
      font-weight: 900;
      &:after {
        left: 0;
        width: 100%;
      }
    }
  }
  .footer-language {
      margin-bottom: 20px;
  }
</style>
