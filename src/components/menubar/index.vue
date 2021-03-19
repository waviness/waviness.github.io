<!-- element menu基本样式切换再次封装 -->
<template>
  <div class="menubarWarp" v-show="menubarList && menubarList.length > 0">
    <el-menu
      :default-active="menubarActiveIndex"
      @select="menuSelect"
      class="el-menu-demo"
      :class="mode === 'vertical' ? 'vertical' : ''"
      text-color="#5c6075"
      :background-color="backgroundColor"
      :active-text-color="activeTextColor"
      :mode="mode"
    >
      <el-menu-item v-for="(item, index) in menubarList" :index="String(index)" :key="index">
        <template slot="title">
          <span>{{ item.label ? item.label : item }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class Menubar extends Vue {
  @Prop() private menubarList!: any // 类型切换（时间类型，或者业务类型等等）
  @Prop({ type: String, default: '0' }) private menubarActiveIndex!: string // 类型默认选择
  @Prop({ type: String, default: '#2362fb' }) private activeTextColor!: string // 切换菜单激活文字颜色
  @Prop({ type: String, default: 'horizontal' }) private mode!: string // 横竖方式 horizontal横着 vertical竖着
  @Prop({ type: String, default: '#e9eef3' }) private backgroundColor!: string // 菜单颜色
  private menuSelect(key: string) {
    this.$emit('menuSelect', key)
  }
}
</script>

<style lang="scss" scoped>
.menubarWarp {
  // padding: 0px 0px 0px 20px;
  .el-menu-demo,
  .el-menu-item {
    background: inherit !important;
  }
  .el-menu-item {
    &:hover {
      background-color: #e9eef3 !important;
    }
  }
  .vertical {
    .el-menu-item {
      &.is-active {
        border-left: 2px solid rgb(252, 146, 63);
        // 根据需要可作调整 统一就行
        background-color: rgba(240, 244, 252, 1) !important;
      }
    }
  }
  .el-menu-item {
    line-height: 46px;
    height: 46px;
  }
  .el-menu.el-menu--horizontal {
    border-width: 0;
  }
}
</style>
