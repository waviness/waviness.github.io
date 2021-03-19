<!-- 基本内容中header封装 -->
<template>
  <div class="containerHeader">
    <div class="title left" v-if="title && title.content">
      <i :class="titleStyle === 'adminColor' ? title.iconfont + ' adminColor' : title.iconfont + ' crmColor'"></i>
      <span class="content fontWeight">
        {{ title.content }}
      </span>
    </div>
    <div class="menubar left" v-show="menubarList && menubarList.length > 0">
      <menu-bar :menubarActiveIndex="menubarActiveIndex" :activeTextColor="activeTextColor" :menubarList="menubarList" @menuSelect="cHeaderMenuSelect"></menu-bar>
    </div>
    <div class="search" v-show="seachNeed" :class="seachPlace === 'center' ? 'center' : 'right'">
      <el-input v-model.trim="seachValue" type="text" :placeholder="placeholder" size="small" @keyup.enter.native="seachValueBtn" @clear="clearValue" clearable>
        <el-button slot="append" icon="el-icon-search" @click="seachValueBtn"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import menuBar from '@/components/menubar/index.vue'
@Component({
  components: {
    menuBar
  }
})
export default class ContainerHeader extends Vue {
  @Prop() private title: any // icon 以及名称
  @Prop() private menubarList!: string[] // 类型切换（时间类型，或者业务类型等等）
  @Prop() private placeholder!: string
  @Prop({ type: String, default: 'adminColor' }) private titleStyle!: string // 颜色
  @Prop({ type: String, default: 'right' }) private seachPlace!: string // 搜索框位置
  @Prop({ type: String, default: '0' }) private menubarActiveIndex!: string // 类型默认选择
  @Prop({ type: String, default: '#2362fb' }) private activeTextColor!: string // 切换菜单激活颜色
  @Prop({ type: Boolean, default: true }) private seachNeed!: boolean // 控制是否显示搜索框
  private seachValue: string = '' // 搜索框绑定值
  // 搜索请求
  private seachValueBtn() {
    this.$emit('seachValueBtn', this.seachValue)
  }
  // 清楚
  private clearValue() {
    this.$emit('clearValue')
  }
  private cHeaderMenuSelect(key: string) {
    this.$emit('cHeaderMenuSelect', key)
  }
}
</script>

<style lang="scss" scoped>
.containerHeader {
  height: 46px;
  position: relative;
  .title {
    line-height: 46px;
    margin: 0 20px;
    display: flex;
    .adminColor {
      color: #fc923f;
    }
    .crmColor {
      color: #2362fb;
    }
    .iconfont {
      font-size: 26px;
      margin-right: 10px;
    }
    .content {
      display: inline-block;
      line-height: 46px;
    }
  }
  .menubar {
    margin-left: 30px;
  }
  .search {
    width: 300px;
    margin: -16px 0 0 -150px;
    position: absolute;
    top: 50%;
    &.center {
      left: 50%;
    }
    &.right {
      right: 20px;
    }
  }
}
</style>
