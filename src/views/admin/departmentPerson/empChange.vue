<!-- 添加人员信息 -->
<template>
  <div class="empChange">
    <el-dialog append-to-body class="dialogStyleChange empChange" title="选择成员关联信息" :visible.sync="empChangeVisible" :before-close="empChangeHandleClose">
      <div class="warp clearfix">
        <div class="mainLeft left">
          <div class="empSeach left">
            <el-input size="small" placeholder="请输入内容" v-model="seachEmpContent" prefix-icon="el-icon-search" @keyup.enter.native="seachEmpInput" @input="seachEmpInput"></el-input>
          </div>
          <div class="infinite-list-wrapper scrollbar" style="overflow:auto">
            <ul class="list" v-infinite-scroll="_getUserList" infinite-scroll-disabled="disabled">
              <li v-for="(item, index) in this.empDataList" class="infinite-list-item" :class="item.active ? 'active' : ''" @click="selectEmpInfor(item)" :key="index">
                <p>
                  {{ item.employeename }}（{{ item.employeeid }}）
                  <span class="right">-- {{ item.opcode }}</span>
                </p>
                <p class="entryInfor">
                  <span v-if="item.zxwxcode" style="margin-right: 20px">微信号：{{ item.zxwxcode }}</span>
                  <span v-if="item.entryid">核算单元ID：{{ item.entryid }}</span>
                </p>
              </li>
            </ul>
            <p class="infinite-p" v-if="loading">
              <i class="el-icon-loading"></i>
            </p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </div>
        <div class="mainRight right">
          <ul>
            <li class="header">已选择的人员信息</li>
            <li class="empName" v-for="(item, index) in chooseEmpList" :key="index">
              {{ item.employeename }}（{{ item.employeeid }}）
              <i class="el-icon-close" @click="deleteChooseEmp(item)"></i>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="empChangeHandleClose">取 消</el-button>
        <el-button size="small" type="warning" @click="empChooseClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getPubEmpList } from '@/api/admin/departmentPerson'
import { compareArr } from '@/utils/common'
@Component
export default class EmpChange extends Vue {
  get disabled() {
    return this.loading || this.noMore
  }
  @Prop() empChangeVisible!: boolean
  @Prop() personDetailInfor!: any
  @Prop() empChooseList!: any
  @Prop() addPersonVisible!: boolean
  private seachEmpContent: string = ''
  private empDataList: any = []
  private chooseEmpList: any = []
  private pageSize: number = 20
  private page: number = 1
  private loading: boolean = false
  private noMore: boolean = false
  private iTime: any = null
  // 点击“x”删除 已存在或再次选择的人员信息
  private deleteChooseEmp(item: any) {
    this.empDataList.forEach((element: any) => {
      // 去点列表点选样式
      if (element.employeeid === item.employeeid) {
        this.$set(element, 'active', false)
      }
    })
    this.chooseEmpList.forEach((element: any, index: number) => {
      if (element.employeeid === item.employeeid) {
        this.chooseEmpList.splice(index, 1)
      }
    })
  }
  // 取消
  private empChangeHandleClose() {
    this.$emit('empChangeHandleClose')
  }
  // 点击确定选择
  private empChooseClick() {
    const deleteUserList = compareArr(this.personDetailInfor.pubEmpList ? this.personDetailInfor.pubEmpList : [], this.chooseEmpList)
    const needVal = {
      dltEmpIdList: deleteUserList,
      addEmpIdList: this.chooseEmpList,
      userIdList: [this.personDetailInfor.userId]
    }
    this.$emit('empChooseClick', needVal)
  }
  // 获取列表
  private async _getUserList(empIdList: any = []) {
    if (this.page === 1) {
      this.empDataList = []
    }
    this.loading = true
    const params = {
      empIdList: empIdList,
      keyword: this.seachEmpContent,
      condition: '',
      inOutFlag: '0',
      pageNum: empIdList.length > 0 ? 1 : this.page,
      pageSize: this.pageSize
    }
    const res = await getPubEmpList(params)
    if (res.success) {
      if (res.code === '200') {
        if (empIdList.length > 0) {
          return res.data.pubEmpList
        }
        this.loading = false
        this.empDataList = this.empDataList.concat(res.data.pubEmpList)
        if (this.chooseEmpList.length > 0) {
          this.empDataList.forEach((element: any) => {
            this.chooseEmpList.forEach((chooseElement: any) => {
              if (element.employeeid === chooseElement.employeeid) {
                // 添加默认选择人员样式
                this.$set(element, 'active', true)
              }
            })
          })
        }
        this.page++
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    } else {
      this.$message.error(res.msg)
    }
  }
  private seachEmpInput() {
    this.$cancelAxios(['list'])
    clearTimeout(this.iTime)
    this.iTime = setTimeout(async () => {
      this.page = 1
      this._getUserList()
    }, 350)
  }
  // 点击列表人员信息 选择关联
  private selectEmpInfor(item: any) {
    // 根据“active”判断是否已经选择当前点击人员 选择过的话取消选择
    if (item.active) {
      this.$set(item, 'active', false)
      this.chooseEmpList.forEach((element: any, index: number) => {
        if (element.employeeid === item.employeeid) {
          this.chooseEmpList.splice(index, 1)
        }
      })
    } else {
      this.$set(item, 'active', true)
      this.chooseEmpList.push({
        employeeid: item.employeeid,
        employeename: item.employeename,
        opcode: item.opcode
      })
    }
  }
  @Watch('chooseEmpList', { deep: true, immediate: true })
  onChooseEmpListChanged(n: any) {
    this.chooseEmpList = n || []
  }
  mounted() {
    console.log(this.personDetailInfor)
    if (this.personDetailInfor.pubEmpList) {
      console.log(this.personDetailInfor.pubEmpList)
      this.chooseEmpList = JSON.parse(JSON.stringify(this.personDetailInfor.pubEmpList))
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.empChange {
  .warp {
    height: 520px;
  }
  .mainLeft {
    width: 50%;
    height: 100%;
    .empSeach {
      width: 100%;
    }
    .infinite-list-wrapper {
      width: 100%;
      height: calc(100% - 15px);
      .infinite-list-item {
        line-height: 26px;
        padding: 3px 5px;
        margin: 2px;
        border-bottom: 1px solid #eee;
        .right {
          color: #777;
          font-size: 12px;
        }
        &:hover {
          background: #f5f7fa;
        }
        .entryInfor {
          color: #888;
          font-size: 12px;
        }
      }
      .active {
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
      }
    }
  }
  .mainRight {
    width: 45%;
    height: 100%;
    padding-left: 20px;
    border-left: 1px solid #e4e6e9;
  }
  .empName {
    color: #000;
    line-height: 28px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 30px;
    position: relative;
    span {
      color: #9b9b9b;
    }
    .el-icon-close {
      width: 20px;
      position: absolute;
      text-align: center;
      right: 5px;
      top: 0px;
      line-height: 28px;
      color: #777;
      cursor: pointer;
      font-weight: 700;
      z-index: 10;
      &:hover {
        background-color: #eee;
      }
    }
  }
  .infinite-p {
    padding: 10px 0px;
    text-align: center;
    i {
      font-size: 26px;
    }
  }
  .el-dialog__footer {
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-top: 1px solid #e4e6e9;
  }
}
</style>
