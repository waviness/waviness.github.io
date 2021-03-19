<template>
  <div class="layoutAdmin">
    <el-container class="mainContainer">
      <el-header>
        <layout-header :moduleName="moduleName"></layout-header>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <el-menu class="el-menu-vertical-demo" :default-active="adminActive" router text-color="#333" active-text-color="#333" :collapse="isCollapse" :unique-opened="true">
            <aside-menu :menuList="adminMenuList">
              <div class="isCollapseWarp" :style="{ width: asideWidth }">
                <i @click="isCollapseClick" class="right" :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
              </div>
            </aside-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <layout-main></layout-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import layoutHeader from './layout-component/layout-header.vue'
import layoutMain from './layout-component/layout-main.vue'
import asideMenu from './layout-component/layout-aside.vue'
import { getLayoutColor } from '@/utils/getLayoutColor'
@Component({
  components: {
    asideMenu,
    layoutHeader,
    layoutMain
  }
})
export default class Layoutadmin extends Vue {
  private moduleName: string = 'admin'
  private adminActive: string = '/admin/adminHome'
  private adminMenuList: any = []
  private asideWidth: string = '220px'
  private isCollapse: boolean = false
  private isCollapseClick() {
    this.isCollapse = !this.isCollapse
    if (this.isCollapse) {
      this.asideWidth = '65px'
    } else {
      this.asideWidth = '220px'
    }
  }
  private _getMenuList() {
    const str = localStorage.getItem('adminMenu')
    if (str) this.adminMenuList = JSON.parse(str).children
    this.setHeaderActive()
  }
  // private _getAsideMenu(pathName: string) {
  //   console.log(pathName)
  //   this.adminMenuList = this.mainMenuList.filter((val: any) => {
  //     return val.path === pathName
  //   })[0].children
  // }
  private setHeaderActive() {
    const routerNowName = this.$route.name
    const routerNowPath = this.$route.path
    let activeIndex
    if (routerNowName && routerNowPath.length - 1 !== routerNowName.length) {
      const getActiveIndex = routerNowPath.substring(0, routerNowPath.length - routerNowName.length - 1)
      activeIndex = getActiveIndex
    } else {
      activeIndex = routerNowPath
    }
    console.log(activeIndex)
  }
  mounted() {
    this.adminActive = this.$route.path
    this._getMenuList()
    getLayoutColor('admin')
  }

  @Watch('$route')
  onRouteChanged(newRoute: any): void {
    this.adminActive = newRoute.path
    this.setHeaderActive()
  }
}
</script>

<style lang="scss">
.layoutAdmin {
  width: 100%;
  height: 100%;
  .el-container {
    height: calc(100% - 60px);
  }
  .mainContainer {
    width: 100%;
    height: 100%;
  }
  .el-header {
    height: 60px;
  }
  .el-aside {
    height: 100%;
    border-top: 3px solid #eee;
    padding: 10px 0px;
    background-color: white;
    position: relative;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    /*隐藏文字*/
    .el-menu--collapse span {
      display: none;
    }
    /*隐藏 > */
    .el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
      display: none;
    }
    .el-menu--collapse {
      width: 65px;
    }
    .el-menu {
      overflow-y: auto;
      height: 100%;
      border: none;
    }
    .isCollapseWarp {
      transition: all 0.3s ease-in-out;
      height: 60px;
      position: absolute;
      bottom: 5px;
      left: 0px;
      .el-icon-s-unfold,
      .el-icon-s-fold {
        color: #666;
        font-size: 24px;
        padding: 18px;
        cursor: pointer;
        margin-right: 5px;
      }
    }
    .iconfont {
      width: 34px;
      display: inline-block;
    }
    .el-menu-item,
    .el-submenu__title,
    .el-submenu .el-menu-item {
      border-left: 3px solid rgb(233, 239, 255);
      color: #333;
      height: 40px;
      line-height: 38px;
    }
    .el-submenu {
      &.is-active {
        .el-submenu__title {
          color: rgba(252, 146, 63, 1) !important;
          i {
            color: rgba(252, 146, 63, 1);
          }
        }
      }
    }
    .el-menu-item {
      &.menu-item-content {
        padding: 0px 14px;
        &.is-active {
          background: rgb(233, 239, 255) !important;
          border-left: 3px solid rgba(252, 146, 63, 1);
          .iconfont {
            color: rgba(252, 146, 63, 1) !important;
          }
          &:hover {
            background: rgb(233, 239, 255) !important;
          }
        }
      }
    }
  }
  .el-main {
    padding: 0px;
    background-color: #f5f6f9;
  }
}
</style>
