<!-- select下拉无限加载 且可搜索封装 -->
<template>
  <div class="selectOptions">
    <el-select
      ref="searchSelect"
      default-first-option
      size="mini"
      value-key="value"
      style="width:100%;"
      @click.native="selectClick"
      @focus="focus"
      :loading="firstLoading"
      v-model="value"
      :no-data-text="empNo"
      @clear="handleclear"
      :filter-method="filterMethod"
      @change="handleChange"
      v-loadmore="getDataList"
      clearable
      filterable
      :multiple="multiple"
      :placeholder="innerPlaceholder"
      :reserve-keyword="reserveKeyword"
    >
      <el-option v-for="item in selectOptions" :key="item[selectvalue] + '' + rowindex + '' + item[selectlabel]" :label="item[selectlabel]" :value="item[selectvalue]">
        <div>
          <span>{{ item[selectvalue] }}</span>
          <span>/{{ item[selectlabel] }}</span>
          <span v-if="otherValue" style="color:#aaa">({{ item[otherValue] }})</span>
        </div>
      </el-option>
      <div class="loading" v-loading="loading"></div>
    </el-select>
  </div>
</template>

<script lang="ts">
import { inputChangeListen } from '@/utils/common'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component
export default class SelectOptions extends Vue {
  @Prop() private selectOptions!: any // select  options值
  @Prop() private interFaceName!: any // 中断接口值
  @Prop({ default: '暂无数据' }) private empNo!: string
  @Prop() private changeValue!: string // 当前选中值
  @Prop() private placeholder!: string
  @Prop({ default: 0 }) private rowindex!: number // 行index
  @Prop({ default: 'label' }) private selectlabel!: string // select绑定的label
  @Prop({ default: 'value' }) private selectvalue!: string // select绑定的value
  @Prop() private otherValue!: string // select绑定的其他值
  @Prop({ default: false }) private multiple!: boolean // 是否支持多选
  @Prop({ default: false }) private reserveKeyword!: boolean // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
  private firstLoading: boolean = false
  private loading: boolean = false
  private value: any = ''
  private searchCondition: any = ''
  private page: number = 1
  private pageSize: number = 10
  private hasNextPage: boolean = true
  private innerPlaceholder: string = ''
  private init() {
    this.page = 1
    this.hasNextPage = true
    this.loading = false
    this.firstLoading = true
  }
  private handleclear() {
    this.value = ''
    if (this.searchCondition) {
      this.searchCondition = ''
      this.init()
      this.getDataList()
    }
    this.$emit('handleclear')
  }
  private filterMethod(val: any) {
    this.$cancelAxios([this.interFaceName])
    this.searchCondition = val
    this.init()
    this.getDataList()
  }
  private handleChange(val: any) {
    this.$emit('handleChange', val)
  }
  private hasNextPageChange() {
    this.hasNextPage = false
  }
  private pageChange() {
    this.page++
  }
  private loadingChange() {
    if (this.loading) {
      this.loading = false
    } else {
      this.loading = true
    }
  }
  private firstloadingChange() {
    this.firstLoading = false
  }
  private getDataList() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      condition: this.searchCondition,
      hasNextPage: this.hasNextPage,
      loading: this.loading
    }
    this.$emit('getDataList', params)
  }
  private focus() {
    this.$emit('focus')
  }
  private selectClick() {
    this.$emit('selectClick')
  }
  @Watch('changeValue')
  onchangeValueChanged(n: any) {
    this.value = n
  }
  mounted() {
    this.value = this.changeValue
    this.getDataList()
    if (this.placeholder) {
      this.innerPlaceholder = this.placeholder
    } else {
      this.innerPlaceholder = '请输入'
    }
    setTimeout(() => {
      inputChangeListen(this, this.$refs.searchSelect as any, 'filterMethod')
    }, 100)
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.selectOptions {
}
</style>
