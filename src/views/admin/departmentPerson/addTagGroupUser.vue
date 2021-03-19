<template>
  <div class="addTagGroupUser">
    <common-dialog :dialogVal="addTagUserdialogVal" :width="'70%'" @handleClose="handleTagUserClose" @handleSure="handletagUserSure">
      <div class="addTagUserDialog clearfix" v-if="addTagUserdialogVal.dialogVisible" slot="dialogbody">
        <div class="depTree left">
          <div class="depTreeSearch">
            <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterDeptText" clearable></el-input>
          </div>
          <div class="depTreeContent" v-loading="depTreeLoading">
            <el-tree
              class="filter-tree"
              :data="depTreeList"
              :props="treeProps"
              node-key="depId"
              default-expand-all
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              :highlight-current="true"
              ref="tree"
              @node-click="depListClick"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label }}</span>
                <i v-if="node.checked" style="color: #ccc;margin-left:5px;" class="el-icon-check"></i>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="userList left">
          <div class="userSearch">
            <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterUserText" @input="filterUserInput" @clear="filterUserclear" clearable></el-input>
          </div>
          <div class="userContent" v-loading="getUserListLoading">
            <el-checkbox v-show="userDataList.length > 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedpeople" @change="handleCheckedPeopleChange">
              <el-checkbox v-for="people in userDataList" :label="people.userId" :key="people.userId">{{ people.userId }}/{{ people.userName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="chooseUser left">
          <ul>
            <li v-for="(item, index) in checkedpeopleDetail" :key="item.userId + index">
              {{ item.userId }} / {{ item.userName }}
              <i class="el-icon-close" @click="deleteCheckedPeo(item)"></i>
            </li>
          </ul>
        </div>
      </div>
    </common-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getDepTree } from '@/api/common'
import { getUserByParams } from '@/api/admin/departmentPerson'
import { DialogType } from '@/types/dialog-type'
import { compareArr } from '@/utils/common'
import commonDialog from '@/components/commonDialog/index.vue'
@Component({
  components: {
    commonDialog
  }
})
export default class TagGroupUserAdd extends Vue {
  @Prop() nowClickTagList: any
  @Prop() addTagUserdialogVal!: DialogType
  private depTreeList: any = [] // 组织架构树结构
  private depTreeLoading: boolean = false // 组织架构树结构
  private filterDeptText: string = '' // 搜索部门
  private filterUserText: string = '' // 人员
  private getUserListLoading: boolean = false // 人员信息列表loading
  private isIndeterminate: boolean = true // 是否清空全选
  private checkAll: boolean = false // 是否全选
  private userDataList: any = [] // 人员信息列表
  private checkedpeople: any = [] // 已选择人员id
  private checkedpeopleDetail: any = [] // 已选择人员列表详情
  private oldCheckedpeople: any = [] // 之前已选择人员id
  // 组织架构树结构 props
  private treeProps: any = {
    value: 'depId',
    label: 'depName',
    children: 'childList'
  }
  // 根据标签ID/组ID + 部门id 获取人员信息 这样的话渲染出已经选择过的人员 已选人员不做选择
  private _getUserByParams(params: any) {
    this.getUserListLoading = true
    getUserByParams(params).then(res => {
      if (res.code === '200') {
        this.getUserListLoading = false
        this.userDataList = res.data
        this.userDataList.filter((item: any) => {
          if ((item.tagId && this.nowClickTagList.tagId) || (item.groupId && this.nowClickTagList.depType === 2)) {
            const hasSaveCheckedpeople = this.oldCheckedpeople.some((selfitem: any) => +item.userId === +selfitem)
            if (!hasSaveCheckedpeople) this.oldCheckedpeople.push(item.userId)
            this.isIndeterminate = true
            const hasCheckedpeople = this.checkedpeople.some((selfitem: any) => +item.userId === +selfitem)
            if (!hasCheckedpeople) this.checkedpeople.push(item.userId)
            console.log(item)
            const hasUser = this.checkedpeopleDetail.some((selfitem: any) => +item.userId === +selfitem.userId)
            console.log(hasUser)
            if (!hasUser) {
              this.checkedpeopleDetail.push({
                userId: item.userId,
                userName: item.userName
              })
            }
          }
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
        this.getUserListLoading = false
      }
    })
  }
  // 人员信息过滤
  private filterUserInput(val: any) {
    const params = {
      depId: '',
      tagId: this.nowClickTagList.tagId,
      groupId: '',
      keyword: val
    }
    this._getUserByParams(params)
    ;(this.$refs.tree as any).setCurrentKey(null)
  }
  // 人员信息过滤关键字清楚
  private filterUserclear() {
    const obj: any = this.$refs.tree
    if (this.depTreeList.length > 0) {
      obj.setCurrentKey(this.depTreeList[0].depId)
      this.depListClick({ depId: this.depTreeList[0].depId })
    }
  }
  // 关闭添加标签人员查看弹框
  private handleTagUserClose() {
    this.$emit('handleTagUserClose')
  }
  // 确认添加标签人员弹框
  private handletagUserSure() {
    const deleteUserList = compareArr(this.oldCheckedpeople, this.checkedpeople)
    const needVal = {
      deleteList: deleteUserList,
      checkedpeople: this.checkedpeople,
      checkedpeopleDetail: this.checkedpeopleDetail
    }
    this.$emit('handletagUserSure', needVal)
  }
  private depListClick(data: any) {
    let params = {}
    if (this.nowClickTagList.tagId) {
      params = {
        depId: data.depId,
        tagId: this.nowClickTagList.tagId,
        groupId: '',
        keyword: ''
      }
    } else if (this.nowClickTagList.depType === 2) {
      params = {
        depId: data.depId,
        tagId: '',
        groupId: this.nowClickTagList.depId,
        keyword: ''
      }
    }
    this._getUserByParams(params)
  }
  // 获取部门树结构信息
  private _getDepTree(
    params: any = {
      treeType: 1
    }
  ) {
    this.depTreeLoading = true
    getDepTree(params).then(res => {
      if (res.code === '200') {
        this.depTreeLoading = false
        this.depTreeList = res.data
        this.$nextTick(() => {
          const obj: any = this.$refs.tree
          if (res.data.length > 0) {
            obj.setCurrentKey(res.data[0].depId)
            this.depListClick({ depId: res.data[0].depId })
          }
          // this.page = 1
          // this._getWxEmpList({
          //   deptCode: res.pageInfo.list[0].DEPT_CODE,
          //   pageSize: this.pageSize,
          //   pageNum: this.page,
          // })
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
        this.depTreeLoading = false
      }
    })
  }
  // 可搜索部门
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.depName.indexOf(value) !== -1
  }
  private handleCheckAllChange(val: any) {
    console.log(val)
    this.checkedpeopleDetail = []
    const checkedAllpeople = []
    for (let index = 0; index < this.userDataList.length; index++) {
      const element = this.userDataList[index]
      checkedAllpeople.push(element.userId)
    }
    this.checkedpeople = val ? checkedAllpeople : []
    for (let index = 0; index < this.checkedpeople.length; index++) {
      const checkedpeopleElement = this.checkedpeople[index]
      for (let index = 0; index < this.userDataList.length; index++) {
        const element = this.userDataList[index]
        if (checkedpeopleElement === element.userId) {
          this.checkedpeopleDetail.push({
            userId: element.userId,
            userName: element.userName
          })
        }
      }
    }
    this.isIndeterminate = false
    // this.salerList = this.checkedpeople
  }
  private handleCheckedPeopleChange(value: any) {
    this.checkedpeopleDetail = []
    console.log(value)
    const checkedCount = value.length
    this.checkAll = checkedCount === this.userDataList.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.userDataList.length
    this.checkedpeople = value
    for (let index = 0; index < this.checkedpeople.length; index++) {
      const checkedpeopleElement = this.checkedpeople[index]
      for (let index = 0; index < this.userDataList.length; index++) {
        const element = this.userDataList[index]
        if (checkedpeopleElement === element.userId) {
          this.checkedpeopleDetail.push({
            userId: element.userId,
            userName: element.userName
          })
        }
      }
    }
    // this.$cancelAxios(['getVisitRecord'])
  }
  // 删除已选人员
  private deleteCheckedPeo(item: any) {
    this.isIndeterminate = this.checkedpeople.length > 0 && this.checkedpeople.length < this.userDataList.length
    for (let index = 0; index < this.checkedpeople.length; index++) {
      const element = this.checkedpeople[index]
      if (+element === +item.userId) {
        this.checkedpeople.splice(index, 1)
      }
    }
    for (let index = 0; index < this.checkedpeopleDetail.length; index++) {
      const element = this.checkedpeopleDetail[index]
      if (+element.userId === +item.userId) {
        this.checkedpeopleDetail.splice(index, 1)
      }
    }
    if (this.checkedpeople.length === 0) {
      this.isIndeterminate = false
      this.checkAll = false
    }
    console.log(this.checkedpeopleDetail)
  }
  mounted() {
    console.log(this.nowClickTagList)
    this._getDepTree()
  }
  @Watch('filterDeptText')
  onFilterTextChanged(val: any) {
    const obj: any = this.$refs.tree
    obj.filter(val)
  }
}
</script>

<style lang="scss" scoped>
.addTagUserDialog {
  height: 520px;
  display: flex;
  .depTree,
  .userList,
  .chooseUser {
    flex: 1;
  }
  .depTree,
  .userList {
    border-right: 1px solid #eee;
  }
  .depTreeSearch,
  .userSearch {
    padding: 10px;
    height: 52px;
  }
  .depTreeContent,
  .userContent {
    padding: 0px 20px;
    overflow: auto;
    height: 470px;
    .el-checkbox {
      width: 100%;
      margin-right: 0px;
      line-height: 26px;
    }
  }
  .chooseUser {
    overflow: auto;
    padding: 0px 10px;
    li {
      cursor: pointer;
      line-height: 30px;
      position: relative;
      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 0px;
        line-height: 30px;
        z-index: 5px;
      }
      &:hover {
        background-color: #ebeef2;
      }
    }
  }
  // height: 100%;
}
</style>
