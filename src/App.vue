<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import '@/assets/css/styleOverlay.scss'
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="scss">
@import url('./assets/css/index.css');
#app {
  width: 100%;
  height: 100%;
}
</style>
