<template>
  <div class="layoutCrm">
    <el-container class="mainContainer">
      <el-header>
        <layout-header :menuList="mainMenuList" :moduleName="moduleName"></layout-header>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <el-menu
            class="el-menu-vertical-demo"
            :default-active="asideActive"
            router
            background-color="rgb(0, 21, 41)"
            text-color="#999"
            active-text-color="#fff"
            :collapse="isCollapse"
            :unique-opened="true"
          >
            <aside-menu :menuList="asideMenuList">
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
import { Getter, namespace } from 'vuex-class'
const userModule = namespace('user') // namespaced为true时候 Mutation使用方式
@Component({
  components: {
    asideMenu,
    layoutHeader,
    layoutMain
  }
})
export default class Layoutcrm extends Vue {
  @userModule.Mutation SET_HEADERACTIVEINDEX: any
  @Getter userHeaderActiveIndex?: string
  private moduleName: string = 'crm'
  private mainMenuList: any = []
  private asideActive: string = '/taskApproval/crmReminder'
  private asideMenuList: any = []
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
    const str = localStorage.getItem('menu')
    if (str) this.mainMenuList = JSON.parse(str)
    console.log(this.mainMenuList)
    this.setHeaderActive()
  }
  private _getAsideMenu(pathName: string) {
    console.log(this.mainMenuList)
    this.asideMenuList = this.mainMenuList.length
      ? this.mainMenuList.filter((val: any) => {
        return val.path === pathName
      })[0].children
      : []
  }
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
    this.SET_HEADERACTIVEINDEX(activeIndex)
  }
  mounted() {
    this.asideActive = this.$route.path
    this._getMenuList()
    if (this.userHeaderActiveIndex) {
      this._getAsideMenu(this.userHeaderActiveIndex)
    }
    getLayoutColor('crm')
  }

  @Watch('$route')
  onRouteChanged(newRoute: any): void {
    console.log(newRoute)
    this.asideActive = newRoute.path
    this.setHeaderActive()
  }

  @Watch('userHeaderActiveIndex')
  onUserHeaderActiveIndexChanged(newActive: any): void {
    if (newActive) {
      this._getAsideMenu(newActive)
    }
  }
}
</script>

<style lang="scss">
.layoutCrm {
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
    padding: 10px 0px;
    background-color: rgb(0, 21, 41);
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
      .el-tooltip {
        padding: 0px !important;
      }
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
        color: white;
        font-size: 24px;
        padding: 18px;
        cursor: pointer;
        margin-right: 5px;
      }
    }
    .iconfont {
      padding-left: 14px;
      width: 34px;
      display: inline-block;
    }
    .el-menu-item,
    .el-submenu .el-menu-item {
      margin: 5px 10px;
      height: 40px;
      line-height: 40px;
      &:hover {
        background-color: rgba(26, 45, 63, 0.8) !important;
      }
      border-radius: 5px;
    }
    .el-menu--inline {
      padding-left: 20px;
      .el-menu-item {
        min-width: 100px;
      }
    }
    .el-submenu__title {
      margin: 5px 10px;
      border-radius: 5px;
      padding: 0 !important;
      height: 40px !important;
      line-height: 40px !important;
      &:hover {
        background-color: rgba(26, 45, 63, 0.8) !important;
      }
    }
    .el-submenu {
      &.is-active {
        .el-submenu__title {
          color: white !important;
          i {
            color: white;
          }
        }
      }
    }
    .el-menu-item {
      padding: 0px !important;
      &.menu-item-content {
        padding: 0px 14px;
        border-radius: 5px;
        &.is-active {
          background: rgb(35, 98, 251) !important;
          &:hover {
            background: rgb(35, 98, 251) !important;
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
