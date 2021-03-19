<!-- 获取部门管理人员 -->
<template>
  <div class="getDepMng">
    <div class="menu clearfix" v-if="(+getDepMsgNeed[0].depType === 1 && getDepMsgNeed[0].depTypeoperationFlag) || getDepMsgNeed[0].depType === 2">
      <div class="button left">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="insertClick"></el-button>
        <!-- <el-button size="mini" type="warning" icon="el-icon-edit"></el-button> -->
        <el-button size="mini" type="success" icon="el-icon-check" @click="saveAllClick"></el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteAllClick"></el-button>
      </div>
    </div>
    <base-table
      @inputClick="tableInputClick"
      @handleSelectionChange="handleSelectionChange"
      :tableHeight="tableHeight"
      :tableDataList="msgList"
      :columns="columns"
      :options="options"
      :operates="(+getDepMsgNeed[0].depType === 1 && getDepMsgNeed[0].depTypeoperationFlag) || getDepMsgNeed[0].depType === 2 ? operates : ''"
    >
      <div v-if="userByDepIdOptions.length > 0" slot="inputTag" slot-scope="{ clumnValue, row }">
        <el-select v-if="clumnValue === 'userId'" size="mini" v-model="row.userId" filterable placeholder="请选择">
          <el-option v-for="item in userByDepIdOptions" :key="item.userId" :label="item.userName" :value="item.userId">
            <span>{{ item.userId }}</span>
            <span>/{{ item.userName }}</span>
            <span style="color:#aaa">({{ item.wxCode }})</span>
          </el-option>
        </el-select>
        <el-select v-if="clumnValue === 'positionId'" size="mini" v-model="row.positionId" filterable placeholder="请选择">
          <el-option v-for="item in positionOptions" :key="item.DIC_SELECT_ID" :label="item.DIC_SELECT_NAME" :value="item.DIC_SELECT_ID" :disabled="item.USESTATUS !== 1">
            <span>{{ item.DIC_SELECT_ID }}</span>
            <span>/{{ item.DIC_SELECT_NAME }}</span>
          </el-option>
        </el-select>
      </div>
    </base-table>
  </div>
</template>

<script lang="ts">
import { getDepMngByDepId, getUserByDepId, insOrUpdDepMng, dltDepMng } from '@/api/admin/departmentPerson'
import { getDictionaries } from '@/api/admin/dictionary'
import paging from '@/components/paging/index.vue'
import baseTable from '@/components/baseTable/index.vue'
import selectOptions from '@/components/selectOptions/index.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
    paging,
    baseTable,
    selectOptions
  }
})
export default class GetDepMng extends Vue {
  @Prop() getDepMsgNeed!: any // 获取当前部门信息
  // 页码 每页数量 以及总数
  private page: number = 1
  private pageSize: number = 20
  private total: number = 0
  private tableHeight: number = 440 // 表格最大高度
  private msgList: any = [] // 部门管理人员信息
  private middlemsgList: any = [] // 获取部门管理人员信息中间值 为了防止点击cancel
  private userByDepIdOptions: any = [] // 人员选择下拉值
  private positionOptions: any = [] // 职位下拉值
  private dltArr: any = [] // 批量删除参数
  protected options: any = {
    border: true,
    size: 'mini',
    stripe: true, // 是否为斑马纹 table
    loading: false, // 是否添加表格loading加载动画
    highlightCurrentRow: true, // 是否支持当前行高亮显示
    mutiSelect: true // 是否支持列表项选中功能
  }
  private columns: any = [
    {
      prop: 'userId',
      label: '姓名',
      align: 'left',
      width: '120px',
      editingType: 'inputTag',
      formatter: (row: any) => {
        return `<span>${row.userId}${row.userName}</span>`
      }
    },
    {
      prop: 'depName',
      label: '部门',
      align: 'left',
      minWidth: '120px',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${row.depId}/${row.depName}</span>`
      }
    },
    {
      prop: 'positionId',
      label: '职务',
      align: 'left',
      minWidth: '100px',
      editingType: 'inputTag',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${row.positionId}/${row.positionName}</span>`
      }
    },
    {
      prop: 'usestatus',
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
        return `<span>${+row.usestatus === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
      }
    }
  ]
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
  // 表格 选择行的时候
  private handleSelectionChange(val: any) {
    console.log(val)
    this.dltArr = []
    for (let index = 0; index < val.selection.length; index++) {
      const element = val.selection[index]
      console.log(element)
      this.dltArr.push(element.cdmId)
    }
  }
  //  获取职务数据字段
  private _getDictionaries() {
    const params = {
      keyword: '',
      pageNum: 1,
      pageSize: 100,
      typeId: 7
    }
    getDictionaries(params).then(res => {
      if (res.code === '200') {
        this.positionOptions = res.data.list
        console.log(res.data)
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 获取部门管理人员信息
  private _getDepMngByDepId() {
    const params = {
      depId: this.getDepMsgNeed[0].depId
    }
    this.options.loading = true
    getDepMngByDepId(params).then(res => {
      if (res.code === '200') {
        this.msgList = res.data
        this.middlemsgList = JSON.parse(JSON.stringify(this.msgList))
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
  // 添加管理人员 根据部门Id获取人员信息 下拉选择
  private _getUserByDepId() {
    const params = {
      depId: this.getDepMsgNeed[0].depId
    }
    getUserByDepId(params).then(res => {
      this.userByDepIdOptions = res.data
      if (this.userByDepIdOptions.length === 0) {
        this.$message({
          message: '当前部门没有人员信息，请先维护人员信息，再添加管理人员',
          type: 'warning'
        })
      }
      console.log(this.userByDepIdOptions)
    })
  }
  // 新增或修改部门管理人员信息
  private _insOrUpdDepMng(params: any, row: any = '') {
    insOrUpdDepMng(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        if (row) {
          this.$set(row, 'editing', false)
          this.$set(row, 'isSaveClick', false)
          this.$set(row, 'cdmId', res.data.returnCmdIdList[0])
          this.positionOptions.filter((val: any) => {
            if (val.DIC_SELECT_ID === row.positionId) {
              this.$set(row, 'positionName', val.DIC_SELECT_NAME)
            }
          })
          this.userByDepIdOptions.filter((val: any) => {
            if (val.userId === row.userId) {
              this.$set(row, 'userName', val.userName)
            }
          })
        } else {
          this._getDepMngByDepId()
        }
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 作废
  private _dltDepMng(params: any) {
    dltDepMng(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.dltArr = []
        this._getDepMngByDepId()
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 新增
  private insertClick() {
    const list = {
      depId: this.getDepMsgNeed[0].depId,
      depName: this.getDepMsgNeed[0].depName,
      positionId: '',
      positionName: '',
      userId: '',
      userName: '',
      usestatus: 1,
      editing: true
    }
    this.msgList.unshift(list)
    this.middlemsgList = JSON.parse(JSON.stringify(this.msgList))
    console.log(this.msgList)
  }
  // 保存所有
  private saveAllClick() {
    const params: any = []
    for (let index = 0; index < this.msgList.length; index++) {
      const element = this.msgList[index]
      if (element.editing) {
        this.$set(element, 'isSaveClick', true)
        if (!element.userId) {
          this.$message({
            message: '人员选择不能为空',
            type: 'warning'
          })
          return
        }
        if (!element.positionId) {
          this.$message({
            message: '职务不能为空',
            type: 'warning'
          })
          return
        }
        params.push({
          cdmId: element.cdmId,
          depId: element.depId,
          positionId: element.positionId,
          userId: element.userId,
          usestatus: element.usestatus
        })
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
    this._insOrUpdDepMng(params)
  }
  // 作废所有
  private deleteAllClick() {
    if (this.dltArr.length === 0) {
      this.$message({
        message: '请选择要删除的数据',
        type: 'warning'
      })
      return
    }
    this._dltDepMng(this.dltArr)
    console.log('作废所有')
  }
  private handleEdit(index: any, row: any, rowIndex: any) {
    console.log(index)
    console.log(row)
    console.log(rowIndex)
    this.$set(row, 'editing', true)
  }
  private handleDel(index: any, row: any, rowIndex: any) {
    console.log(index)
    console.log(row)
    console.log(rowIndex)
    const params = [row.cdmId]
    this._dltDepMng(params)
  }
  private handleSave(index: any, row: any, rowIndex: any) {
    this.$set(row, 'isSaveClick', true)
    if (!row.userId) {
      this.$message({
        message: '人员选择不能为空',
        type: 'warning'
      })
      return
    }
    if (!row.positionId) {
      this.$message({
        message: '职务不能为空',
        type: 'warning'
      })
      return
    }
    const params = [
      {
        cdmId: row.cdmId,
        depId: row.depId,
        positionId: row.positionId,
        userId: row.userId,
        usestatus: row.usestatus
      }
    ]
    console.log(params)
    this._insOrUpdDepMng(params, row)
    console.log(index)
    console.log(row)
    console.log(rowIndex)
  }
  private handleCancel(index: any, row: any, rowIndex: any) {
    if (row.cdmId) {
      const dataRow = JSON.parse(JSON.stringify(this.middlemsgList))
      this.$set(dataRow[rowIndex], 'editing', false)
      this.$set(this.msgList, rowIndex, dataRow[rowIndex])
    } else {
      this.msgList.splice(rowIndex, 1)
      this.middlemsgList.splice(rowIndex, 1)
    }
    console.log(index)
    console.log(row)
    console.log(rowIndex)
  }
  // 表格中input 点击
  private tableInputClick(val: any) {
    this.$set(this.msgList[val.index], 'isSaveClick', false)
  }
  mounted() {
    this._getDepMngByDepId()
    this._getUserByDepId()
    this._getDictionaries()
    console.log(this.getDepMsgNeed)
  }
}
</script>

<style lang="scss" scoped>
.getDepMng {
  width: 100%;
  position: relative;
  min-height: 150px;
  .menu {
    .button {
      margin: 0px 10px 9px 0px;
    }
  }
}
</style>
