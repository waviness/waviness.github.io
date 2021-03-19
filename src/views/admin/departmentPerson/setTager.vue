<!-- 设置人员标签  -->
<template>
  <div class="setTager" v-loading="tagLoading">
    <div class="content" v-if="tagDataList.length > 0">
      <ul class="clearfix personHeader">
        <li class="left">
          {{ nowClickTagList && nowClickTagList.tagName ? nowClickTagList.tagName : tagDataList.length > 0 ? tagDataList[tagIndex].tagName : '' }}
        </li>
        <li class="right">
          <span class="button-text" @click="tagDetailClick">标签详情</span>
          <span class="button-text" @click="changeTagName">修改名称</span>
          <span class="button-text" @click="tagDelete">删除</span>
        </li>
      </ul>
      <ul class="personHandle">
        <li class="peoButton">
          <!-- <el-button size="small" @click="addPeoClick">{{ btnTabStatus === 1 ? '添加部门/成员' : '添加成员' }}</el-button> -->
          <el-button type="warning" plain size="small" @click="addTagUser">添加成员</el-button>
          <!-- <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 1" @click="setUpLabelClick">{{ btnTabStatus === 1 ? '移出至-标签' : '设置人员标签' }}</el-button>
            <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 2" @click="setUpGroupClick">{{ btnTabStatus === 2 ? '移出至-组' : '设置人员组' }}</el-button> -->
          <el-button type="warning" plain size="small" @click="shiftOutClick">移出</el-button>
        </li>
      </ul>
    </div>
    <div class="noTag" v-if="tagDataList.length === 0 && !tagLoading">
      <i class="iconfont ytcrm-shengqian"></i>
      <el-button size="small" @click="addTag">添加标签</el-button>
    </div>
    <common-dialog :dialogVal="dialogVal" @handleClose="handleTagClose" @handleSure="handleDepSure('tagForm')">
      <div slot="dialogbody" v-if="dialogVal.dialogVisible">
        <el-form :model="tagForm" :rules="tagRole" ref="tagForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="标签名称" prop="tagName">
            <el-input size="small" v-model="tagForm.tagName"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="tagEgn">
            <el-input size="small" v-model="tagForm.tagEgn"></el-input>
          </el-form-item>
          <el-form-item label="标签描述">
            <el-input size="small" type="textarea" v-model="tagForm.tagDic"></el-input>
          </el-form-item>
          <el-form-item label="标签类型" prop="tagType">
            <el-select size="small" v-model="tagForm.tagType" placeholder="请选择">
              <el-option v-for="item in tagTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </common-dialog>
    <common-dialog :dialogVal="tagDetaildialogVal" @handleClose="handleDetailClose" :footerShow="false">
      <div slot="dialogbody" v-loading="tagDetailLoading">
        <div class="detailHeader clearfix">
          <i class="left iconfont ytcrm-shengqian"></i>
          <span class="left">{{ tagDetailInfor.tagId }} / {{ tagDetailInfor.tagName }}</span>
        </div>
        <ul class="detailContent">
          <li>
            <span class="title">英文名称：</span>
            <span class="name">{{ tagDetailInfor.tagKeyword }}</span>
          </li>
          <li>
            <span class="title">标签描述：</span>
            <span class="name">{{ tagDetailInfor.tagDescription }}</span>
          </li>
          <li>
            <span class="title">创建时间：</span>
            <span class="name">{{ new Date(tagDetailInfor.credate).toLocaleString() }}</span>
          </li>
          <li>
            <span class="title">修改人员：</span>
            <span class="name">{{ tagDetailInfor.updateId }}/{{ tagDetailInfor.updateName }}</span>
          </li>
        </ul>
      </div>
    </common-dialog>
    <taggroup-user
      v-if="addTagUserdialogVal.dialogVisible"
      :addTagUserdialogVal="addTagUserdialogVal"
      @handleTagUserClose="handleTagUserClose"
      @handletagUserSure="handletagUserSure"
      :nowClickTagList="nowClickTagList && nowClickTagList.tagId ? nowClickTagList : tagDataList[0]"
    ></taggroup-user>
  </div>
</template>

<script lang="ts">
import BaseCommon from '@/assets/mixin/baseCommon'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { getUserAndDep } from '@/api/common'
import { insOrUpdUsertag, dltUsertag, getUsertag, insOrUpdUserUsertag } from '@/api/admin/departmentPerson'
import { DialogType } from '@/types/dialog-type'
import { tagFormValidate, tagrulesValidate } from '@/types/department'
import taggroupUser from './addTagGroupUser.vue'
@Component({
  components: {
    taggroupUser
  }
})
export default class SetTager extends Mixins(BaseCommon) {
  @Prop() tagIndex: any // 当前点击标签index
  @Prop() nowClickTagList: any // 当前点击标签内容
  @Prop() tableSelectList: any // 表格选择的人员
  private tagDataList: any = [] // 标签信息列表
  private tagLoading: boolean = false // 获取标签loading
  private tagId: any = '' // 修改请求
  // 添加标签成员弹框
  private addTagUserdialogVal: DialogType = {
    dialogVisible: false,
    title: '添加标签人员信息'
  }
  private tagDetailInfor: any = {} // 标签详情信息
  private tagDetailLoading: any = {} // 标签详情加载中
  private tagDetaildialogVal: DialogType = {
    dialogVisible: false,
    title: '标签详情'
  } // 弹框参数
  private dialogVal: DialogType = {
    dialogVisible: false,
    title: '新建标签'
  } // 弹框参数
  // 标签信息参数
  private tagForm: tagFormValidate = {
    tagName: '',
    tagEgn: '',
    tagDic: '',
    tagType: '2'
  }
  private tagRole: tagrulesValidate = {
    tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    tagEgn: [{ required: true, message: '请输入标签英文名称', trigger: 'blur' }],
    tagDic: [{ required: true, message: '请输入标签描述', trigger: 'blur' }],
    tagType: [{ required: true, message: '请选择标签类型', trigger: 'change' }]
  }
  // 标签类型
  private tagTypeOptions: any = [
    {
      value: 1,
      label: '流转标签'
    },
    {
      value: 2,
      label: '用户身份标签'
    }
  ]
  // 组织架构树结构 props
  private treeProps: any = {
    value: 'depId',
    label: 'depName',
    children: 'childList'
  }
  // 可搜索部门
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.depName.indexOf(value) !== -1
  }

  // 根据关键字查询人员、标签信息、部门信息
  private _getUserAndDep(params: any) {
    this.tagLoading = true
    getUserAndDep(params).then((res: any) => {
      if (res.code === '200') {
        this.tagLoading = false
        console.log(res.data.crmUsertagDOList)
        this.tagDataList = res.data.crmUsertagDOList || []
        this.$emit('getTagList', this.tagDataList)
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
        this.tagLoading = false
      }
    })
  }
  // 删除标签信息
  private _dltUsertag(params: any) {
    dltUsertag(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getUserAndDepList('')
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 新增或修改标签信息
  private _insOrUpdUsertag(params: any) {
    insOrUpdUsertag(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getUserAndDepList('')
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 点击新增标签
  private addTag() {
    this.tagId = ''
    this.tagForm = {
      tagName: '',
      tagEgn: '',
      tagDic: '',
      tagType: '2'
    }
    this.dialogVal.title = '添加标签'
    this.dialogVal.dialogVisible = true
  }
  // 获取标签信息
  private getUserAndDepList(val: string) {
    const params = {
      keyword: val,
      searchType: 1
    }
    this._getUserAndDep(params)
  }
  // 删除标签信息
  private dltUsertagInfor() {
    const params = [this.nowClickTagList && this.nowClickTagList.tagId ? this.nowClickTagList.tagId : this.tagDataList[0].tagId]
    this._dltUsertag(params)
  }
  // 点击查看标签详情
  private tagDetailClick() {
    this.tagDetaildialogVal.dialogVisible = true
    this.tagDetailLoading = true
    const params = { tagId: this.nowClickTagList && this.nowClickTagList.tagId ? this.nowClickTagList.tagId : this.tagDataList[0].tagId }
    getUsertag(params).then(res => {
      if (res.code === '200') {
        this.tagDetailLoading = false
        this.tagDetailInfor = res.data
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 修改标签内容
  private changeTagName() {
    this.tagId = this.nowClickTagList && this.nowClickTagList.tagId ? this.nowClickTagList.tagId : this.tagDataList[0].tagId
    this.tagForm = {
      tagName: this.nowClickTagList && this.nowClickTagList.tagName ? this.nowClickTagList.tagName : this.tagDataList[0].tagName,
      tagEgn: this.nowClickTagList && this.nowClickTagList.tagKeyword ? this.nowClickTagList.tagKeyword : this.tagDataList[0].tagKeyword,
      tagDic: this.nowClickTagList && this.nowClickTagList.tagDescription ? this.nowClickTagList.tagDescription : this.tagDataList[0].tagDescription,
      tagType: this.nowClickTagList && this.nowClickTagList.tagType ? this.nowClickTagList.tagType : this.tagDataList[0].tagType
    }
    this.dialogVal.title = '修改标签'
    this.dialogVal.dialogVisible = true
  }
  // 删除标签
  private tagDelete() {
    this.$confirm('确定删除当前标签?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.dltUsertagInfor()
    })
  }
  // 确认添加标签人员查看弹框
  private handletagUserSure(val: any) {
    const params = {
      addUserIdList: val.checkedpeople,
      dltUserIdList: val.deleteList,
      tagId: this.nowClickTagList.tagId ? this.nowClickTagList.tagId : this.tagDataList.length > 0 ? this.tagDataList[0].tagId : ''
    }
    insOrUpdUserUsertag(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.addTagUserdialogVal.dialogVisible = false
        this.$emit('getUserDetail', this.nowClickTagList.tagId ? this.nowClickTagList.tagId : this.tagDataList.length > 0 ? this.tagDataList[0].tagId : '')
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 移出
  private shiftOutClick() {
    if (this.tableSelectList.length === 0) {
      this.$message({
        message: '请选择要移出的人员信息',
        type: 'warning'
      })
      return
    }
    const val = {
      checkedpeople: [],
      deleteList: this.tableSelectList
    }
    this.handletagUserSure(val)
  }
  // 关闭添加标签人员查看弹框
  private handleTagUserClose() {
    this.addTagUserdialogVal.dialogVisible = false
  }
  // 关闭标签详情查看弹框
  private handleDetailClose() {
    this.tagDetaildialogVal.dialogVisible = false
  }
  // 关闭标签修改或添加弹框
  private handleTagClose() {
    this.dialogVal.dialogVisible = false
  }
  // 确定标签修改或添加弹框
  private handleDepSure(formName: any) {
    ;(this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        const params: any = [
          {
            tagId: this.tagId,
            tagName: this.tagForm.tagName,
            tagKeyword: this.tagForm.tagEgn,
            tagDescription: this.tagForm.tagDic,
            tagType: this.tagForm.tagType
          }
        ]
        this._insOrUpdUsertag(params)
        this.dialogVal.dialogVisible = false
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  // 点击加入标签人员信息
  private addTagUser() {
    this.addTagUserdialogVal.dialogVisible = true
  }
  mounted() {
    this.getUserAndDepList('')
  }
}
</script>

<style lang="scss" scoped>
.setTager {
  width: 100%;
  height: fit-content;
  min-height: 100px;
  position: relative;
  .content {
    .personHeader {
      padding: 0px 15px;
      color: #000;
      font-size: 16px;
      line-height: 40px;
    }
    .personHandle {
      margin: 0px 15px;
      padding: 6px 10px;
      background-color: #ebeef2;
      border-bottom: 1px solid #bdc9d6;
    }
  }
  .detailHeader {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    i {
      display: inline-block;
      width: 60px;
      height: 60px;
      color: #fff;
      background: #409eff;
      font-size: 30px;
      text-align: center;
      line-height: 60px;
    }
    span {
      margin-left: 20px;
      font-size: 16px;
      display: inline-block;
      line-height: 60px;
    }
  }
  .detailContent {
    padding: 10px 0px 0px;
    li {
      font-size: 13px;
      line-height: 36px;
    }
    span {
      display: inline-block;
    }
    .title {
      width: 70px;
      text-align: right;
      color: #787878;
    }
    .value {
      padding-left: 20px;
    }
  }
  .noTag {
    position: absolute;
    bottom: 200px;
    left: 0px;
    width: 100%;
    height: 100px;
    text-align: center;
    i {
      display: block;
      font-size: 50px;
      color: #777;
      margin-bottom: 5px;
    }
  }
  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
</style>
