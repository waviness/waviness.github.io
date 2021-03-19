<!-- 客情数据字典维护 -->
<template>
  <div class="customdataDic">
    <header>
      <container-header :title="title" :placeholder="placeholder" :seachPlace="seachPlace" @seachValueBtn="seachValueBtn"></container-header>
    </header>
    <div class="commmonMain">
      <div class="menu clearfix">
        <menu-bar class="left" :menubarList="menubarList" @menuSelect="menuSelect" :activeTextColor="activeTextColor"></menu-bar>
        <div class="button right">
          <el-select
            @change="deptPostSelectChange"
            v-if="menuIndex === 3 || menuIndex === 4"
            :borderColor="insertHasClick && !deptPost ? 'danger' : ''"
            class="deptPostSelect"
            size="mini"
            v-model="deptPost"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in deptPostOptions" :key="item.CD_ID" :label="item.DIC_SELECT_NAME" :value="item.DIC_SELECT_ID">
              <span style="float: left">{{ item.DIC_SELECT_NAME }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.DIC_SELECT_ID }}</span>
            </el-option>
          </el-select>
          <el-select @change="labelSelectChange" class="deptPostSelect" v-if="menuIndex === 5" size="mini" v-model="labelValue" filterable clearable placeholder="请选择">
            <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
    <paging :page="page" :pageSize="pageSize" :total="total"></paging>
  </div>
</template>

<script lang="ts">
import BaseCommon from '@/assets/mixin/baseCommon'
import { Component, Mixins } from 'vue-property-decorator'
import { insDictionaries, dltDictionaries } from '@/api/admin/dictionary'
import { getDictionaries } from '@/api/common'
@Component
export default class CustomdataDic extends Mixins(BaseCommon) {
  // container-header所需参数
  private title: any = {
    iconfont: 'iconfont ytcrm-keqingguanli',
    content: '客情数据字典维护'
  }
  private placeholder: string = '名称|ID'
  private activeTextColor: string = '#fc923f'
  private seachPlace: string = 'center'
  private menubarList: string[] = ['客户学术专线', '客户科室角色信息', '客户科室信息', '客户职务信息', '标签信息']
  private menuIndex: number = 1
  private tableDataList: any = [] // 表格数据
  private middleTableDataList: any = [] // 记录中间数据 防止改动后点击取消 无法恢复
  private deptPost: any = '' // 类型为客户科室信息， 客户职务信息时候选择上一级绑定值
  private deptPostOptions: any = []
  private insertHasClick: boolean = false // 判断类型为3，4时  下拉选型是否为空 为空表格边框变红且提示
  private labelValue: any = ''
  private labelOptions: any = [
    {
      value: 1,
      label: '周报选项'
    },
    {
      value: 2,
      label: '客情备注选项'
    }
  ]
  private columns: any = [
    {
      prop: 'DIC_SELECT_ID',
      label: '字典类型ID',
      align: 'left',
      width: '120px',
      editingType: 'input',
      formatter: (row: any) => {
        return `<span>${row.DIC_SELECT_ID}</span>`
      }
    },
    {
      prop: 'DIC_SELECT_NAME',
      label: '字典类型名称',
      align: 'left',
      minWidth: '100px',
      editingType: 'input',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${row.DIC_SELECT_NAME}</span>`
      }
    },
    {
      prop: 'USESTATUS',
      label: '状态',
      align: 'left',
      minWidth: '100px',
      editingType: 'select',
      selectOptions: [
        {
          value: 1,
          label: '正式'
        },
        {
          value: 2,
          label: '作废'
        }
      ],
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
      }
    },
    {
      prop: 'UPDATE_ID',
      label: '操作人员信息',
      align: 'left',
      minWidth: '200px',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        if (row.UPDATE_ID) {
          return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
        }
      }
    },
    {
      prop: 'UPDATE_TIME',
      label: '操作时间',
      align: 'left',
      minWidth: '160px'
      // , column: any, cellValue: any
    }
    // {
    //   prop: 'state',
    //   label: '状态',
    //   align: 'center',
    //   render: (h: any, params: any) => {
    //     return h(
    //       'el-tag',
    //       {
    //         props: { type: params.row.state === 0 ? 'success' : params.row.state === 1 ? 'info' : 'danger', size: 'small' } // 组件的props
    //       },
    //       params.row.state === 0 ? '上架' : params.row.state === 1 ? '下架' : '审核中'
    //     )
    //   }
    // }
  ]
  // protected options: any = {
  //   border: false,
  //   size: 'mini',
  //   stripe: true, // 是否为斑马纹 table
  //   loading: false, // 是否添加表格loading加载动画
  //   highlightCurrentRow: true, // 是否支持当前行高亮显示
  //   mutiSelect: true // 是否支持列表项选中功能
  // }
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
  } // 列操作按钮
  // 搜索数据字典信息
  private seachValueBtn(val: string) {
    console.log(val)
  }
  // 标签切换
  private menuSelect(val: string) {
    console.log(val)
    this.insertHasClick = false
    this.menuIndex = +val + 1
    this.$cancelAxios(['getDictionaries'])
    const type = +val + 1
    switch (type) {
      case 1:
        this.columns = [
          {
            prop: 'DIC_SELECT_ID',
            label: '字典类型ID',
            align: 'left',
            width: '120px',
            editingType: 'input',
            formatter: (row: any) => {
              return `<span>${row.DIC_SELECT_ID}</span>`
            }
          },
          {
            prop: 'DIC_SELECT_NAME',
            label: '字典类型名称',
            align: 'left',
            minWidth: '100px',
            editingType: 'input',
            formatter: (row: any) => {
              return `<span>${row.DIC_SELECT_NAME}</span>`
            }
          },
          {
            prop: 'USESTATUS',
            label: '状态',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '正式'
              },
              {
                value: 2,
                label: '作废'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
            }
          },
          {
            prop: 'UPDATE_ID',
            label: '操作人员信息',
            align: 'left',
            minWidth: '200px',
            formatter: (row: any) => {
              if (row.UPDATE_ID) {
                return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
              }
            }
          },
          {
            prop: 'UPDATE_TIME',
            label: '操作时间',
            align: 'left',
            minWidth: '160px'
          }
        ]
        this.getDictionariesFun(type)
        break
      case 2:
        this.columns = [
          {
            prop: 'DIC_SELECT_ID',
            label: '角色ID',
            align: 'left',
            width: '120px',
            editingType: 'input'
          },
          {
            prop: 'DIC_SELECT_NAME',
            label: '角色名称',
            align: 'left',
            minWidth: '100px',
            editingType: 'input'
          },
          {
            prop: 'USESTATUS',
            label: '状态',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '正式'
              },
              {
                value: 2,
                label: '作废'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
            }
          },
          {
            prop: 'UPDATE_ID',
            label: '操作人员信息',
            align: 'left',
            minWidth: '150px',
            formatter: (row: any) => {
              if (row.UPDATE_ID) {
                return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
              }
            }
          },
          {
            prop: 'UPDATE_TIME',
            label: '操作时间',
            align: 'left',
            minWidth: '150px'
          }
        ]
        this.getDictionariesFun(type)
        break
      case 3:
        this.columns = [
          {
            prop: 'DIC_UPPER_SELECT_ID',
            label: '角色ID',
            align: 'left',
            width: '100px'
          },
          {
            prop: 'DIC_UPPER_SELECT_NAME',
            label: '角色名称',
            align: 'left',
            minWidth: '100px'
          },
          {
            prop: 'DIC_SELECT_ID',
            label: '科室ID',
            align: 'left',
            width: '120px',
            editingType: 'input'
          },
          {
            prop: 'DIC_SELECT_NAME',
            label: '科室名称',
            align: 'left',
            width: '120px',
            editingType: 'input'
          },
          {
            prop: 'USESTATUS',
            label: '状态',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '正式'
              },
              {
                value: 2,
                label: '作废'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
            }
          },
          {
            prop: 'UPDATE_ID',
            label: '操作人员信息',
            align: 'left',
            minWidth: '150px',
            formatter: (row: any) => {
              if (row.UPDATE_ID) {
                return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
              }
            }
          },
          {
            prop: 'UPDATE_TIME',
            label: '操作时间',
            align: 'left',
            minWidth: '150px'
          }
        ]
        this.deptPost = ''
        this.getDictionariesFun(2, true)
        this.getDictionariesFun(type)
        break
      case 4:
        this.columns = [
          {
            prop: 'DIC_UPPER_SELECT_ID',
            label: '科室ID',
            align: 'left',
            width: '100px'
          },
          {
            prop: 'DIC_UPPER_SELECT_NAME',
            label: '科室名称',
            align: 'left',
            minWidth: '100px'
          },
          {
            prop: 'DIC_SELECT_ID',
            label: '职务ID',
            align: 'left',
            width: '120px',
            editingType: 'input'
          },
          {
            prop: 'DIC_SELECT_NAME',
            label: '职务名称',
            align: 'left',
            width: '120px',
            editingType: 'input'
          },
          {
            prop: 'USESTATUS',
            label: '状态',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '正式'
              },
              {
                value: 2,
                label: '作废'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
            }
          },
          {
            prop: 'UPDATE_ID',
            label: '操作人员信息',
            align: 'left',
            minWidth: '150px',
            formatter: (row: any) => {
              if (row.UPDATE_ID) {
                return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
              }
            }
          },
          {
            prop: 'UPDATE_TIME',
            label: '操作时间',
            align: 'left',
            minWidth: '150px'
          }
        ]
        this.deptPost = ''
        this.getDictionariesFun(3, true)
        this.getDictionariesFun(type)
        break
      case 5:
        this.columns = [
          {
            prop: 'DIC_SELECT_ID',
            label: '备注标签ID',
            align: 'left',
            width: '120px',
            editingType: 'input',
            formatter: (row: any) => {
              return `<span>${row.DIC_SELECT_ID}</span>`
            }
          },
          {
            prop: 'DIC_SELECT_NAME',
            label: '备注标签名称',
            align: 'left',
            minWidth: '100px',
            editingType: 'input',
            formatter: (row: any) => {
              return `<span>${row.DIC_SELECT_NAME}</span>`
            }
          },
          {
            prop: 'TYPE_SECOND_ID',
            label: '类型',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '周报选项'
              },
              {
                value: 2,
                label: '客情备注选项'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span class="fontWeight">周报选项</span>' : '<span class="fontWeight">客情备注选项</span>'}</span>`
            }
          },
          {
            prop: 'USESTATUS',
            label: '状态',
            align: 'left',
            minWidth: '100px',
            editingType: 'select',
            selectOptions: [
              {
                value: 1,
                label: '正式'
              },
              {
                value: 2,
                label: '作废'
              }
            ],
            formatter: (row: any) => {
              return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
            }
          },
          {
            prop: 'UPDATE_ID',
            label: '操作人员信息',
            align: 'left',
            minWidth: '200px',
            formatter: (row: any) => {
              if (row.UPDATE_ID) {
                return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
              }
            }
          },
          {
            prop: 'UPDATE_TIME',
            label: '操作时间',
            align: 'left',
            minWidth: '160px'
          }
        ]
        this.deptPost = ''
        this.getDictionariesFun(type)
        break
      default:
        break
    }
  }
  // 类型为3,4的时候下拉切换
  private deptPostSelectChange(val: any) {
    this.getDictionariesFun(this.menuIndex, false, val)
  }
  private labelSelectChange(val: any) {
    const params = {
      typeId: 5,
      keyword: '',
      pageSize: this.pageSize,
      pageNum: this.page,
      typeSecondId: val
    }
    this._getDictionaries(params)
  }
  private getDictionariesFun(type: number, getSelectOptions: boolean = false, dicUpperSelectId: string = '') {
    const params = {
      typeId: type,
      keyword: '',
      pageSize: getSelectOptions ? 100 : this.pageSize,
      pageNum: this.page,
      dicUpperSelectId: dicUpperSelectId
    }
    this._getDictionaries(params, getSelectOptions)
  }
  // 获取数据字典信息
  private _getDictionaries(params: any, getSelectOptions: boolean = false) {
    if (!getSelectOptions) {
      this.options.loading = true
    }
    getDictionaries(params).then(res => {
      if (res.code === '200') {
        if (getSelectOptions) {
          this.deptPostOptions = res.data.list
        } else {
          this.total = res.data.total
          this.tableDataList = res.data.list
          this.middleTableDataList = JSON.parse(JSON.stringify(this.tableDataList))
          this.options.loading = false
        }
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
          this.getDictionariesFun(this.menuIndex)
        }
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  private _dltDictionaries(params: any) {
    dltDictionaries(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })

        this.getDictionariesFun(this.menuIndex)
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 表格中input点击
  private inputClick(val: any) {
    console.log(val)
    this.$set(this.tableDataList[val.index], 'isSaveClick', false)
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
    let params: any = []
    if (row.TYPE_ID === 1 || row.TYPE_ID === 2) {
      if (!row.DIC_SELECT_ID) {
        this.$message({
          message: '字典类型ID不能为空',
          type: 'warning'
        })
        return
      }
      if (!row.DIC_SELECT_NAME) {
        this.$message({
          message: '字典类型名称不能为空',
          type: 'warning'
        })
        return
      }
      params = [
        {
          typeId: this.menuIndex,
          cdId: row.CD_ID,
          dicSelectId: row.DIC_SELECT_ID,
          dicSelectName: row.DIC_SELECT_NAME,
          dicSelectDescription: row.DIC_SELECT_DESCRIPTION,
          usestatus: row.USESTATUS
        }
      ]
    } else if (row.TYPE_ID === 3 || row.TYPE_ID === 4) {
      const contentSuper = row.TYPE_ID === 3 ? '角色信息不能为空' : row.TYPE_ID === 4 ? '科室信息不能为空' : ''
      const content = row.TYPE_ID === 3 ? '科室信息不能为空' : row.TYPE_ID === 4 ? '职务信息不能为空' : ''
      if (!row.DIC_UPPER_SELECT_ID) {
        this.$message({
          message: contentSuper,
          type: 'warning'
        })
        return
      }
      if (!row.DIC_SELECT_ID || !row.DIC_SELECT_NAME) {
        this.$message({
          message: content,
          type: 'warning'
        })
        return
      }
      params = [
        {
          typeId: this.menuIndex,
          cdId: row.CD_ID,
          upperTypeId: this.menuIndex === 3 ? 2 : this.menuIndex === 4 ? 3 : '',
          dicUpperSelectId: row.DIC_UPPER_SELECT_ID,
          dicSelectId: row.DIC_SELECT_ID,
          dicSelectName: row.DIC_SELECT_NAME,
          dicSelectDescription: row.DIC_SELECT_DESCRIPTION,
          usestatus: row.USESTATUS
        }
      ]
    } else if (row.TYPE_ID === 5) {
      if (!row.DIC_SELECT_ID || !row.DIC_SELECT_NAME) {
        this.$message({
          message: '标签信息不能为空',
          type: 'warning'
        })
        return
      }
      params = [
        {
          typeId: this.menuIndex,
          cdId: row.CD_ID,
          typeSecondId: row.TYPE_SECOND_ID,
          dicSelectId: row.DIC_SELECT_ID,
          dicSelectName: row.DIC_SELECT_NAME,
          dicSelectDescription: row.DIC_SELECT_DESCRIPTION,
          usestatus: row.USESTATUS
        }
      ]
    }
    console.log(row)
    console.log(params)
    this._insDictionaries(params, row)
    console.log(' index:', index)
    console.log(' row:', row)
    console.log(' rowIndex:', rowIndex)
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
    console.log(' index:', index)
    console.log(' rowIndex:', rowIndex)
    console.log(' row:', row)
  }
  // 新增
  private insertClick() {
    let list = {}
    if (this.menuIndex === 3 || this.menuIndex === 4) {
      const contentSuper = this.menuIndex === 3 ? '角色信息不能为空' : this.menuIndex === 4 ? '科室信息不能为空' : ''
      if (!this.deptPost) {
        this.$message({
          message: contentSuper,
          type: 'warning'
        })
        this.insertHasClick = true
        return
      }
      console.log(this.deptPost)
      list = {
        TYPE_ID: this.menuIndex,
        DIC_UPPER_SELECT_ID: this.deptPost,
        DIC_UPPER_SELECT_NAME: '',
        DIC_SELECT_ID: '',
        DIC_SELECT_NAME: '',
        UPDATE_NAME: '',
        USESTATUS: 1,
        editing: true
      }
    } else if (this.menuIndex === 5) {
      list = {
        TYPE_ID: this.menuIndex,
        TYPE_SECOND_ID: 1,
        DIC_SELECT_ID: '',
        DIC_SELECT_NAME: '',
        UPDATE_NAME: '',
        USESTATUS: 1,
        editing: true
      }
    } else {
      list = {
        TYPE_ID: this.menuIndex,
        DIC_SELECT_ID: '',
        DIC_SELECT_NAME: '',
        UPDATE_NAME: '',
        USESTATUS: 1,
        editing: true
      }
    }
    this.tableDataList.unshift(list)
    this.middleTableDataList = JSON.parse(JSON.stringify(this.tableDataList))
  }
  private saveAllClick() {
    console.log(this.tableDataList)
    const params: any = []
    for (let index = 0; index < this.tableDataList.length; index++) {
      const element = this.tableDataList[index]
      if (element.editing) {
        this.$set(element, 'isSaveClick', true)
        if (element.TYPE_ID === 1 || element.TYPE_ID === 2) {
          if (!element.DIC_SELECT_ID) {
            this.$message({
              message: '字典类型ID不能为空',
              type: 'warning'
            })
            return
          }
          if (!element.DIC_SELECT_NAME) {
            this.$message({
              message: '字典类型名称不能为空',
              type: 'warning'
            })
            return
          }
          params.push({
            typeId: this.menuIndex,
            cdId: element.CD_ID,
            dicSelectId: element.DIC_SELECT_ID,
            dicSelectName: element.DIC_SELECT_NAME,
            dicSelectDescription: element.DIC_SELECT_DESCRIPTION,
            usestatus: element.USESTATUS
          })
        } else if (element.TYPE_ID === 3 || element.TYPE_ID === 4) {
          const contentSuper = element.TYPE_ID === 3 ? '角色信息不能为空' : element.TYPE_ID === 4 ? '科室信息不能为空' : ''
          const content = element.TYPE_ID === 3 ? '科室信息不能为空' : element.TYPE_ID === 4 ? '职务信息不能为空' : ''
          if (!element.DIC_UPPER_SELECT_ID) {
            this.$message({
              message: contentSuper,
              type: 'warning'
            })
            return
          }
          if (!element.DIC_SELECT_ID || !element.DIC_SELECT_NAME) {
            this.$message({
              message: content,
              type: 'warning'
            })
            return
          }
          params.push({
            typeId: this.menuIndex,
            cdId: element.CD_ID,
            upperTypeId: this.menuIndex === 3 ? 2 : this.menuIndex === 4 ? 3 : '',
            dicUpperSelectId: element.DIC_UPPER_SELECT_ID,
            dicSelectId: element.DIC_SELECT_ID,
            dicSelectName: element.DIC_SELECT_NAME,
            dicSelectDescription: element.DIC_SELECT_DESCRIPTION,
            usestatus: element.USESTATUS
          })
        } else if (element.TYPE_ID === 5) {
          if (!element.DIC_SELECT_ID || !element.DIC_SELECT_NAME) {
            this.$message({
              message: '标签信息不能为空',
              type: 'warning'
            })
            return
          }
          params.push({
            typeId: this.menuIndex,
            cdId: element.CD_ID,
            typeSecondId: element.TYPE_SECOND_ID,
            dicSelectId: element.DIC_SELECT_ID,
            dicSelectName: element.DIC_SELECT_NAME,
            dicSelectDescription: element.DIC_SELECT_DESCRIPTION,
            usestatus: element.USESTATUS
          })
        }
      }
    }
    console.log(params)
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
    this.getDictionariesFun(this.menuIndex)
  }
}
</script>

<style lang="scss" scoped>
.customdataDic {
  height: 100%;
  position: relative;
  .menu {
    padding: 0px 20px;
    background-color: #e9eef3;
    .button {
      padding-top: 8px;
      margin-right: 10px;
    }
    .deptPostSelect {
      margin-right: 10px;
    }
  }
  .mainTable {
    padding: 0px 20px;
    height: calc(100% - 108px);
  }
}
</style>
