<!--  单一数据字典封装  -->
<template>
  <div class="commonDic">
    <header>
      <container-header :title="title" :placeholder="placeholder" :seachPlace="seachPlace" @seachValueBtn="seachValueBtn"></container-header>
    </header>
    <div class="commmonMain">
      <div class="menu clearfix">
        <div class="button" :class="btnPlace === 'right' ? 'right' : 'left'">
          <el-button size="mini" type="warning" icon="el-icon-plus" @click="insertClick"></el-button>
          <!-- <el-button size="mini" type="warning" icon="el-icon-edit"></el-button> -->
          <el-button size="mini" type="success" icon="el-icon-check" @click="saveAllClick"></el-button>
        </div>
      </div>
      <div class="mainTable">
        <base-table :tableHeight="tableHeight" :tableDataList="tableDataList" :columns="columns" :options="options" :operates="operates" @inputClick="inputClick">
          <!-- <div slot="inputTag">1212</div> -->
        </base-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseCommon from '@/assets/mixin/baseCommon'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { insDictionaries, dltDictionaries } from '@/api/admin/dictionary'
import { getDictionaries } from '@/api/common'
@Component({})
export default class CommonDic extends Mixins(BaseCommon) {
  @Prop() typeDic!: number // 字典类型
  @Prop() columns!: any // 表格参数
  @Prop({ default: 'left' }) btnPlace!: string
  @Prop() menubarList: any
  @Prop() title!: any
  // container-header所需参数
  private placeholder: string = '名称|ID'
  private seachPlace: string = 'center'
  private tableDataList: any = [] // 表格数据
  private middleTableDataList: any = [] // 记录中间数据 防止改动后点击取消 无法恢复
  // 列操作按钮
  private operates: any = {
    width: 200,
    fixed: '',
    initButtonList: [
      {
        id: '1',
        label: '编辑',
        type: '',
        size: 'mini',
        show: true,
        plain: true,
        disabled: false,
        method: (index: any, row: any, rowIndex: any = '') => {
          this.handleEdit(index, row, rowIndex)
        }
      },
      {
        id: '2',
        label: '作废',
        type: 'danger',
        size: 'mini',
        show: true,
        plain: false,
        disabled: false,
        method: (index: any, row: any, rowIndex: any = '') => {
          this.handleDel(index, row, rowIndex)
        }
      }
    ],
    clickButtonList: [
      {
        id: '3',
        label: '保存',
        type: 'success',
        size: 'mini',
        show: false,
        plain: false,
        disabled: false,
        method: (index: any, row: any, rowIndex: any = '') => {
          this.handleSave(index, row, rowIndex)
        }
      },
      {
        id: '4',
        label: '取消',
        type: 'warning',
        size: 'mini',
        show: false,
        plain: false,
        disabled: false,
        method: (index: any, row: any, rowIndex: any = '') => {
          this.handleCancel(index, row, rowIndex)
        }
      }
    ]
  }
  // 获取表格数据
  private getDictionariesFun() {
    const params = {
      typeId: this.typeDic,
      keyword: '',
      pageSize: this.pageSize,
      pageNum: this.page
    }
    this._getDictionaries(params)
  }
  // 新增
  private insertClick() {
    const list = {
      TYPE_ID: this.typeDic,
      DIC_SELECT_ID: '',
      DIC_SELECT_NAME: '',
      UPDATE_NAME: '',
      USESTATUS: 1,
      editing: true
    }
    this.tableDataList.unshift(list)
    this.middleTableDataList = JSON.parse(JSON.stringify(this.tableDataList))
  }
  // 获取数据字典信息
  private _getDictionaries(params: any) {
    this.options.loading = true
    getDictionaries(params).then(res => {
      if (res.code === '200') {
        this.total = res.data.total
        this.tableDataList = res.data.list
        this.middleTableDataList = JSON.parse(JSON.stringify(this.tableDataList))
        this.options.loading = false
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
        this.options.loading = false
      }
    })
  }
  // 新增或者编辑数据字典
  private _insDictionaries(params: any, row: any = '') {
    insDictionaries(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        if (row) {
          this.$set(row, 'editing', false)
          this.$set(row, 'isSaveClick', false)
          this.$set(row, 'CD_ID', res.data[0])
        } else {
          this.getDictionariesFun()
        }
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 删除数据字典数据
  private _dltDictionaries(params: any) {
    dltDictionaries(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getDictionariesFun()
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 编辑
  private handleEdit(index: any, row: any, rowIndex: any) {
    this.$set(row, 'editing', true)
    console.log(' rowIndex:', rowIndex)
  }
  // 删除
  private handleDel(index: any, row: any, rowIndex: any) {
    console.log(' index:', index)
    console.log(' row:', row)
    console.log(' rowIndex:', rowIndex)
    const params = [
      {
        cdId: row.CD_ID
      }
    ]
    this._dltDictionaries(params)
  }
  // 保存
  private handleSave(index: any, row: any, rowIndex: any) {
    this.$set(row, 'isSaveClick', true)
    if (!row.DIC_SELECT_ID) {
      this.$message({
        message: '职务ID不能为空',
        type: 'warning'
      })
      return
    }
    if (!row.DIC_SELECT_NAME) {
      this.$message({
        message: '职务名称不能为空',
        type: 'warning'
      })
      return
    }
    const params: any = [
      {
        typeId: this.typeDic,
        cdId: row.CD_ID,
        dicSelectId: row.DIC_SELECT_ID,
        dicSelectName: row.DIC_SELECT_NAME,
        dicSelectDescription: row.DIC_SELECT_DESCRIPTION,
        usestatus: row.USESTATUS
      }
    ]
    console.log(row)
    console.log(params)
    console.log(rowIndex)
    this._insDictionaries(params, row)
  }
  // 取消
  private handleCancel(index: any, row: any, rowIndex: any) {
    if (row.CD_ID) {
      const dataRow = JSON.parse(JSON.stringify(this.middleTableDataList))
      this.$set(dataRow[rowIndex], 'editing', false)
      this.$set(this.tableDataList, rowIndex, dataRow[rowIndex])
    } else {
      this.tableDataList.splice(rowIndex, 1)
      this.middleTableDataList.splice(rowIndex, 1)
    }
  }
  // 搜索数据字典信息
  private seachValueBtn(val: string) {
    console.log(val)
  }
  // 表格中input点击
  private inputClick(val: any) {
    console.log(val)
    this.$set(this.tableDataList[val.index], 'isSaveClick', false)
  }
  // 批量保存
  private saveAllClick() {
    const params: any = []
    for (let index = 0; index < this.tableDataList.length; index++) {
      const element = this.tableDataList[index]
      if (element.editing) {
        this.$set(element, 'isSaveClick', true)
        if (!element.DIC_SELECT_ID) {
          this.$message({
            message: '职务ID不能为空',
            type: 'warning'
          })
          return
        }
        if (!element.DIC_SELECT_NAME) {
          this.$message({
            message: '职务名称不能为空',
            type: 'warning'
          })
          return
        }
        params.push({
          typeId: this.typeDic,
          cdId: element.CD_ID,
          dicSelectId: element.DIC_SELECT_ID,
          dicSelectName: element.DIC_SELECT_NAME,
          dicSelectDescription: element.DIC_SELECT_DESCRIPTION,
          usestatus: element.USESTATUS
        })
      }
    }
    if (params.length === 0) {
      this.$message({
        message: '没有任何新增或修改的操作',
        type: 'warning'
      })
      return
    }
    this._insDictionaries(params)
  }
  mounted() {
    this.getDictionariesFun()
  }
}
</script>

<style lang="scss" scoped>
.commonDic {
  width: 100%;
  height: 100%;
  .menu {
    padding: 0px 20px;
    background-color: #e9eef3;
    .button {
      padding-top: 8px;
      margin: 0px 10px 9px 10px;
    }
  }
  .mainTable {
    padding: 0px 20px;
    height: calc(100% - 108px);
  }
}
</style>
