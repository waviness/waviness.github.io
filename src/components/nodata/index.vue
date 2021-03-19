<template>
  <div class="nodata">
    <div class="img">
      <img src="../../assets/images/nodata.png" alt="" />
    </div>
    <div class="text">{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class Nodata extends Vue {
  @Prop({ default: '暂无数据' }) message!: string
}
</script>

<style lang="scss" scoped>
.nodata {
  width: 100%;
  padding: 30px 0px 0px;
  text-align: center;
  .img {
    margin: 0 auto;
    width: 150px;
    img {
      width: 100%;
    }
  }
  .text {
    color: #ddd;
    line-height: 36px;
  }
}
</style>
