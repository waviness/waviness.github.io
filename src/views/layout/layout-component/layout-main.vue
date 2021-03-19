<template>
  <div class="layoutMain">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class LayoutMain extends Vue {}
</script>

<style lang="scss" scoped>
.layoutMain {
  width: 100%;
  height: 100%;
}
</style>
