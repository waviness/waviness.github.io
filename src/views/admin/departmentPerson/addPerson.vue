<!-- 新增成员 -->
<template>
  <div class="addPerson">
    <common-dialog :dialogVal="addPersondialogVal" :width="'50%'" @handleClose="addPersonClose" @handleSure="addPersonSure('addPerRef')">
      <div v-if="addPersondialogVal.dialogVisible" slot="dialogbody">
        <el-form :model="personForm" :rules="personRules" ref="addPerRef" label-width="80px" class="demo-ruleForm clearfix">
          <div class="content left">
            <el-form-item label="登录名" prop="userCode">
              <el-input size="small" v-model="personForm.userCode"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userName">
              <el-input size="small" v-model="personForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNum">
              <el-input size="small" v-model="personForm.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="座机">
              <el-input size="small" v-model="personForm.telNum"></el-input>
            </el-form-item>
          </div>
          <div class="content right">
            <el-form-item label="性别">
              <el-radio-group v-model="personForm.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="微信号" prop="wxCode">
              <el-input size="small" v-model="personForm.wxCode"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input size="small" type="email" v-model="personForm.emailAddress"></el-input>
            </el-form-item>
            <el-form-item label="上级领导">
              <el-select @change="userLeaderChange" ref="userLeaderSelect" size="small" v-model="personForm.userLeaderId" filterable placeholder="请选择上级领导" clearable>
                <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId">
                  <span style="float: left">{{ item.userId }} / {{ item.userName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="oneLine left">
            <el-form-item class="left" label="部门信息">
              <span v-show="depchooseList" class="departInforShow left" v-for="(item, index) in depchooseList" :key="index">
                {{ item.depName }}
                <i v-if="item.isMain">主</i>
              </span>
              <li class="departInforOperate left">
                <span @click="departClick">{{ depchooseList && depchooseList.length > 0 ? '修改' : '点击添加部门信息' }}</span>
              </li>
            </el-form-item>
          </div>
          <el-form-item class="left" style="width: 100%" label="角色信息" prop="roleId">
            <el-select size="small" v-model="personForm.roleId" filterable multiple placeholder="试试搜索">
              <el-option v-for="item in sysRole.concat(leaderRole).concat(baseRole)" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                <span style="float: left">{{ item.roleId }} / {{ item.roleName }}</span>
              </el-option>
            </el-select>
            <!-- <el-cascader
              placeholder=""
              v-model=""
              :options="depTreeList"
              :props="{ multiple: true, checkStrictly: true, emitPath: false, value: 'depId', label: 'depName', children: 'childList' }"
              filterable
            ></el-cascader> -->
          </el-form-item>
          <el-form-item class="left" style="width: 100%" label="人员关联">
            <!-- <el-select size="small" v-model="personForm.pm4PersonConcat" filterable multiple placeholder="请选择PM4人员关联信息">
              <el-option v-for="item in pm4PersonList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                <span style="float: left">{{ item.roleId }} / {{ item.roleName }}</span>
              </el-option>
            </el-select> -->
            <select-options
              :changeValue="personForm.pm4PersonConcat"
              ref="userselectOption"
              :multiple="true"
              :interFaceName="'getPubEmpList'"
              :selectOptions="userOptions"
              @getDataList="_getPubEmpList"
              @handleChange="userhandleChange"
              :reserveKeyword="true"
            ></select-options>
            <!-- <el-cascader
              placeholder=""
              v-model=""
              :options="depTreeList"
              :props="{ multiple: true, checkStrictly: true, emitPath: false, value: 'depId', label: 'depName', children: 'childList' }"
              filterable
            ></el-cascader> -->
          </el-form-item>
          <!-- <el-form-item label="手机号">
            <el-cascader
              size="small"
              @change="belongDepChange"
              v-model="depruleForm.belongDep"
              :options="depTreeList"
              :props="{ checkStrictly: true, emitPath: false, value: 'depId', label: 'depName', children: 'childList' }"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所属部门" prop="belongDep" v-if="pointChangeType === 2">
            <span class="fontWeight" v-if="nowClickTreeRow.length > 0">{{ nowClickTreeRow[0].depId }}/{{ nowClickTreeRow[0].depName }}</span>
            <span class="fontWeight" v-else>{{ nowClickTreeRow.depId }}/{{ nowClickTreeRow.depName }}</span>
          </el-form-item> -->
        </el-form>
      </div>
    </common-dialog>
    <depart-change
      v-if="departChangedialogVal.dialogVisible"
      :departChooseList="depchooseList"
      :departChangedialogVal="departChangedialogVal"
      @departChangeHandleClose="departChangeHandleClose"
      @departChangeHandleSure="departChangeHandleSure"
    ></depart-change>
  </div>
</template>

<script lang="ts">
import { getUserAndDep } from '@/api/common'
import { getPubEmpList } from '@/api/admin/departmentPerson'
import { getRoles } from '@/api/admin'
import { Component, Vue, Prop } from 'vue-property-decorator'
import departChange from './departChange.vue'
import commonDialog from '@/components/commonDialog/index.vue'
import selectOptions from '@/components/selectOptions/index.vue'
import { DialogType } from '@/types/dialog-type'
import { personValidate, personrulesValidate } from '@/types/department'
@Component({
  components: {
    commonDialog,
    departChange,
    selectOptions
  }
})
export default class AddPerson extends Vue {
  @Prop() addPersondialogVal!: DialogType
  @Prop() departChooseList!: any
  @Prop() editingUserDetail!: any
  private depchooseList: any = []
  private departChangedialogVal: any = {
    dialogVisible: false,
    title: '选择成员所属部门'
  }
  private userList: any = []
  private personForm: personValidate = {
    userId: '', // 用户id
    userCode: '', // 用户名
    userName: '', // 真实姓名
    userType: 1, // 用户类型
    wxCode: '', // 微信号
    emailAddress: '', // 邮箱
    gender: 1, // 性别
    phoneNum: '', // 电话
    telNum: '', // 座机
    roleId: '', // 角色
    userLeaderId: '', // 上级领导id
    userLeaderName: '', // 上级领导名称
    userMainDepName: '', // 主部门名称
    userMainDepNum: '', // 主部门id
    pm4PersonConcat: '' // pm4人员关联
  }
  private personRules: personrulesValidate = {
    userCode: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    userName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    wxCode: [{ required: true, message: '请输入微信号', trigger: 'blur' }],
    emailAddress: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
    phoneNum: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
    telNum: [{ required: true, message: '请输入座机', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
    userLeaderId: [{ required: true, message: '请选择上级领导', trigger: 'change' }],
    userMainDepNum: [{ required: true, message: '请选择主部门', trigger: 'blur' }]
  }
  private depTreeList: any = [] // 组织架构树结构
  private sysRole: any = [] // 系统角色
  private leaderRole: any = [] // 领导角色
  private baseRole: any = [] // 基础角色
  private pm4PersonList: any = [] // PM4人员信息列表
  private userOptions: any = [] // PM4人员信息列表
  // 关闭添加标签人员查看弹框
  private addPersonClose() {
    this.$emit('addPersonClose')
  }
  // 确认添加标签人员弹框
  private addPersonSure(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        const val = {
          personForm: this.personForm,
          departChooseList: this.depchooseList
        }
        console.log(this.personForm)
        console.log(this.depchooseList)
        this.$emit('addPersonSure', val)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  // 获取人员信息
  private _getUserAndDep() {
    const params = {
      keyword: '',
      searchType: 0
    }
    getUserAndDep(params).then(res => {
      console.log(res)
      if (res.code === '200') {
        this.userList = res.data.crmUserList
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  private userLeaderChange(val: any) {
    console.log(val)
    let obj: any = null
    obj = this.userList.find((item: any) => {
      return item.userId === val
    })
    this.personForm.userLeaderName = obj.userName
    this.personForm.userLeaderId = val
    console.log(this.personForm.userLeaderName)
  }
  // 点击添加部门信息
  private departClick() {
    this.departChangedialogVal.dialogVisible = true
  }
  // 关闭点选部门弹框
  private departChangeHandleClose() {
    this.departChangedialogVal.dialogVisible = false
  }
  // 确定点选部门弹框
  private departChangeHandleSure(val: any) {
    console.log(val)
    this.depchooseList = [...val.depList]
    this.departChangedialogVal.dialogVisible = false
  }
  private userhandleChange(val: any) {
    console.log(val)
    this.personForm.pm4PersonConcat = val
  }
  private _getRoles(type: any) {
    const params = {
      roleType: type
    }
    getRoles(params).then(res => {
      if (res.code === '200') {
        switch (type) {
          case 1:
            this.sysRole = res.data
            break
          case 2:
            this.leaderRole = res.data
            break
          case 3:
            this.baseRole = res.data
            break
          default:
            break
        }
      }
    })
  }
  private async _getPubEmpList(params: any) {
    console.log(params)
    const obj: any = this.$refs.userselectOption
    if (params.page === 1) {
      this.userOptions = []
    }
    if (params.hasNextPage && !params.loading) {
      obj.loadingChange()
      const useParams = {
        pageNum: params.page,
        pageSize: params.pageSize,
        keyword: params.condition,
        empIdList: []
      }
      console.log(useParams)
      const res = await getPubEmpList(useParams)
      console.log(res)
      if (res.success) {
        obj.loadingChange()
        obj.firstloadingChange()
        for (let index = 0; index < res.data.pubEmpList.length; index++) {
          const element = res.data.pubEmpList[index]
          this.userOptions.push({
            label: element.employeename,
            value: element.employeeid,
            opcode: element.opcode,
            success: res.success
          })
        }
        console.log(this.userOptions)
        if (!res.data.hasNextPage) {
          obj.hasNextPageChange()
        }
        obj.pageChange()
      }
    }
  }
  mounted() {
    this._getUserAndDep()
    this._getRoles(1)
    this._getRoles(2)
    this._getRoles(3)
    if (this.editingUserDetail) {
      const roleIdList: any = []
      for (let index = 0; index < this.editingUserDetail.crmRoleList.length; index++) {
        const element = this.editingUserDetail.crmRoleList[index]
        roleIdList.push(element.roleId)
      }
      console.log(this.editingUserDetail.crmRoleList)
      this.personForm = {
        userId: this.editingUserDetail.userId, // 用户id
        userCode: this.editingUserDetail.userCode, // 用户名
        userName: this.editingUserDetail.userName, // 真实姓名
        userType: 1, // 用户类型
        wxCode: this.editingUserDetail.wxCode, // 微信号
        emailAddress: this.editingUserDetail.emailAddress, // 邮箱
        gender: this.editingUserDetail.gender, // 性别
        phoneNum: this.editingUserDetail.phoneNum, // 电话
        telNum: this.editingUserDetail.telNum, // 座机
        roleId: roleIdList, // 角色
        userLeaderId: this.editingUserDetail.userLeaderId, // 上级领导id
        userLeaderName: this.editingUserDetail.userLeaderName, // 上级领导名称
        userMainDepName: this.editingUserDetail.userMainDepName, // 主部门名称
        userMainDepNum: this.editingUserDetail.userMainDepNum, // 主部门id
        pm4PersonConcat: this.editingUserDetail.pubEmpList // pm4人员关联
      }
      for (let index = 0; index < this.editingUserDetail.crmDepList.length; index++) {
        const element = this.editingUserDetail.crmDepList[index]
        if (this.editingUserDetail.userMainDepNum === element.depId) {
          this.depchooseList.push({
            depId: element.depId,
            depName: element.depName,
            isMain: true
          })
        } else {
          this.depchooseList.push({
            depId: element.depId,
            depName: element.depName,
            isMain: false
          })
        }
      }
    } else {
      this.depchooseList = JSON.parse(JSON.stringify(this.departChooseList))
    }
  }
}
</script>

<style lang="scss" scoped>
.addPerson {
  .content {
    width: 49%;
    .el-select {
      width: 100%;
    }
  }
  .oneLine {
    width: 100%;
  }
  .departInforShow {
    margin-top: 10px;
    font-size: 12px;
    line-height: 1.5;
    padding: 2px 7px 3px 11px;
    background-color: #fff;
    border: 1px solid #e4e6e9;
    border-radius: 2px;
    margin-bottom: 4px;
    margin-right: 5px;
    i {
      background: #ccc;
      padding: 2px;
      color: white;
    }
  }
  .departInforOperate {
    margin: 11px 8px 3px 0;
    line-height: 20px;
    span {
      color: #0c4c7f;
      cursor: pointer;
      &:hover {
        font-weight: 700;
      }
    }
  }
  .el-select {
    width: 100%;
  }
}
</style>
