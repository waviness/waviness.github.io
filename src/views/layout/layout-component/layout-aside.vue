<template>
  <div class="menuSun">
    <template v-for="menuitem in menuList">
      <el-submenu class="menu-item-content" :index="menuitem.path" v-if="+menuitem.pmsType === 2 && menuitem.children && menuitem.children.length > 0" :key="menuitem.path + menuitem.pmsId">
        <template slot="title">
          <i :class="menuitem.icon"></i>
          <span slot="title">{{ menuitem.pmsName.replace('*', '') }}</span>
        </template>
        <menuSun :menuList="menuitem.children" />
      </el-submenu>
      <el-menu-item class="menu-item-content" v-else :key="menuitem.path + menuitem.pmsId" :index="menuitem.path">
        <template>
          <i :class="menuitem.icon"></i>
          <span slot="title">{{ menuitem.pmsName.replace('*', '') }}</span>
        </template>
      </el-menu-item>
    </template>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'menuSun'
})
export default class MenuSun extends Vue {
  @Prop() private menuList: any
}
</script>

<style lang="scss">
.menuSun {
  overflow-x: hidden;
  max-height: calc(100% - 60px);
}
</style>
