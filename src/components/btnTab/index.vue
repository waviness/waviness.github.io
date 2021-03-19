<!-- 按钮切换 -->
<template>
  <div class="btnTab">
    <ul class="clearfix">
      <li @click="btnTabClick(index)" :class="activeIndex === index ? 'active' : ''" v-for="(item, index) in tabList" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class BtnTab extends Vue {
  @Prop() private tabList!: string[]
  private activeIndex: number = 0
  // 点击切换标签
  private btnTabClick(index: number) {
    this.activeIndex = index
    this.$emit('btnTabClick', index)
  }
}
</script>

<style lang="scss" scoped>
.btnTab {
  border-radius: 2px;
  font-size: 14px;
  line-height: 24px;
  .clearfix {
    display: flex;
    border: 1px solid #eee;
    border-width: 1px 1px 1px 0;
    li {
      cursor: pointer;
      text-align: center;
      border-left: 1px solid #eee;
      flex: 1;
    }
  }
  .active {
    background-color: #aaa;
    border-color: #aaa;
    color: #fff;
  }
}
</style>
