<!-- 部门人员关系管理 -->
<template>
  <div class="departmentPerson">
    <header>
      <container-header :title="title" :placeholder="placeholder" :activeTextColor="activeTextColor" :seachPlace="seachPlace" @seachValueBtn="seachValueBtn"></container-header>
    </header>
    <main>
      <div class="deptLeft left">
        <div class="deptHeader clearfix">
          <div class="deptSeach left">
            <el-input size="small" :placeholder="seachPlaceHolder" v-model="seachDeptContent" prefix-icon="el-icon-search" @clear="clearPersonDept" @input="seachPersonDept" clearable></el-input>
          </div>
          <div class="deptAdd left" @click="deptAddClick">
            <i class="el-icon-plus fontWeight"></i>
          </div>
        </div>
        <div class="buttonTab">
          <btn-tab :tabList="tabList" @btnTabClick="btnTabClick"></btn-tab>
        </div>
        <div class="depTree" v-show="btnTabStatus === 0 || btnTabStatus === 2" v-loading="depTreeLoading">
          <el-tree
            v-show="!seachDeptContent"
            ref="depTree"
            :data="depTreeList"
            :props="treeProps"
            node-key="depId"
            default-expand-all
            check-on-click-node
            :expand-on-click-node="false"
            :highlight-current="true"
            @node-click="departListClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.depId }}/{{ node.label }}</span>
              <!-- <i class="iconfont icon-diandiandian" @click.stop="depChangeClick(data)"></i> -->
              <el-dropdown
                v-if="btnTabStatus === 0"
                @command="val => handleCommand(val, data)"
                :ref="'dropdown' + data.depId"
                trigger="click"
                size="mini"
                placement="bottom-start"
                @visible-change="isVisible => visibleChange(isVisible, 'dropdown' + data.depId)"
              >
                <span class="el-dropdown-link" @click.stop="depChangeClick(data, $event)">
                  <i class="iconfont ytcrm-diandiandian"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add" v-show="data.operationFlag">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="update" v-show="data.operationFlag">修改名称</el-dropdown-item>
                  <el-dropdown-item command="getDeptMng">查看管理人员</el-dropdown-item>
                  <el-dropdown-item command="delete" v-show="data.operationFlag">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown
                v-if="btnTabStatus === 2 && !data.parentId"
                @command="val => grouphandleCommand(val, data)"
                :ref="'dropdown' + data.depId"
                trigger="click"
                size="mini"
                placement="bottom-start"
                @visible-change="isVisible => visibleChange(isVisible, 'dropdown' + data.depId)"
              >
                <span class="el-dropdown-link" @click.stop="depChangeClick(data, $event)">
                  <i class="iconfont ytcrm-diandiandian"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子组</el-dropdown-item>
                  <el-dropdown-item command="update">修改名称</el-dropdown-item>
                  <el-dropdown-item command="getDeptMng">查看组管理人员</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </el-tree>
          <div v-show="seachDeptContent" class="personDepartContent">
            <ul class="personList" v-if="crmUserList.length > 0 && btnTabStatus === 0">
              <li class="personDepartHeader">成员</li>
              <li class="persondeptList" v-for="(item, index) in crmUserList" @click="personDeptClick(item, index, 'emp')" :class="item.active ? 'active' : ''" :key="index">
                <span class="empInfor slh">{{ item.userId }}({{ item.userName }})</span>
                <span class="deptInfor slh">{{ item.userMainDepNum }}/{{ item.userMainDepName }}</span>
              </li>
            </ul>
            <ul class="departList" v-if="crmDepList.length > 0 && btnTabStatus === 0">
              <li class="personDepartHeader">部门</li>
              <li class="persondeptList" v-for="(item, index) in crmDepList" @click="personDeptClick(item, index, 'dept')" :class="item.active ? 'active' : ''" :key="index">
                <i class="el-icon-folder-opened"></i>
                {{ item.depId }}/{{ item.depName }}
              </li>
            </ul>
            <ul class="departList" v-if="crmGroupList.length > 0 && btnTabStatus === 2">
              <li class="personDepartHeader">组</li>
              <li class="persondeptList" v-for="(item, index) in crmGroupList" @click="personDeptClick(item, index, 'group')" :class="item.active ? 'active' : ''" :key="index">
                <i class="el-icon-folder-opened"></i>
                {{ item.depId }}/{{ item.depName }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 标签 -->
        <div class="depTree" v-if="btnTabStatus === 1" v-loading="tagLoading">
          <ul class="tagList" v-show="!seachDeptContent">
            <li class="tagListItem" :class="tagActiveIndex === index ? 'active' : ''" v-for="(item, index) in tagDataList" :key="index" @click="tagClick(item, index)">
              {{ item.tagName }}
            </li>
          </ul>
          <div v-show="seachDeptContent" class="personDepartContent">
            <ul class="departList" v-if="crmtagList.length > 0">
              <li class="personDepartHeader">标签</li>
              <li class="persondeptList" v-for="(item, index) in crmtagList" @click="personDeptClick(item, index, 'tag')" :class="item.active ? 'active' : ''" :key="index">
                <i class="el-icon-folder-opened"></i>
                {{ item.tagId }}/{{ item.tagName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="personRight left" v-if="btnTabStatus === 0">
        <ul class="clearfix personHeader">
          <li class="left" v-if="btnTabStatus === 0">
            {{ nowClickTreeRow[0] ? nowClickTreeRow[0].depName : '' }}
          </li>
          <li class="right">
            <span class="button-text" v-show="nowClickTreeRow[0] && nowClickTreeRow[0].operationFlag" @click="handleCommand('detailAdd', {})">添加子部门</span>
            <span class="button-text" v-show="nowClickTreeRow[0] && nowClickTreeRow[0].operationFlag" @click="handleCommand('detailUpdate', {})">修改名称</span>
            <span class="button-text" @click="handleCommand('detailGetDeptMng', {})">查看管理人员</span>
          </li>
        </ul>
        <ul class="personHandle">
          <li class="peoButton">
            <el-button size="small" type="warning" plain v-show="btnTabStatus === 0" @click="addPeoClick">新增成员</el-button>
            <el-button size="small" type="warning" plain v-show="btnTabStatus === 0" @click="setUpDepartmentClick">设置所在部门</el-button>
            <el-button size="small" type="warning" plain v-show="btnTabStatus === 0" @click="setUpEmpClick">设置人员关联</el-button>
            <el-button size="small" type="warning" plain v-show="btnTabStatus === 0" @click="setUpRoleClick">设置人员角色</el-button>
            <!-- <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 1" @click="setUpLabelClick">{{ btnTabStatus === 1 ? '移出至-标签' : '设置人员标签' }}</el-button>
            <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 2" @click="setUpGroupClick">{{ btnTabStatus === 2 ? '移出至-组' : '设置人员组' }}</el-button> -->
            <el-button size="small" type="warning" plain @click="deletePeoClick">删除</el-button>
          </li>
        </ul>
        <div class="mainTable" v-loading="tableDataLoading">
          <base-table
            @handleSelectionChange="handleSelectionChange"
            @handleClickChange="handleClickChange"
            :tableHeight="tableHeight"
            :tableDataList="tableDataList"
            :columns="columns"
            :options="options"
            :operates="operates"
          >
            <!-- <div slot="inputTag">1212</div> -->
          </base-table>
        </div>
        <paging :page="page" :pageSize="pageSize" :total="total"></paging>
      </div>
      <div class="personRight left" v-if="btnTabStatus === 1">
        <set-tager ref="setTag" :tableSelectList="tableSelectList" @getTagList="getTagList" :tagIndex="tagActiveIndex" @getUserDetail="getUserDetail" :nowClickTagList="nowClickTagList"></set-tager>
        <div class="mainTable" v-show="!tagLoading" v-loading="tableDataLoading">
          <base-table
            @handleSelectionChange="handleSelectionChange"
            @handleClickChange="handleClickChange"
            :tableHeight="tableHeight"
            :tableDataList="tableDataList"
            :columns="columns"
            :options="options"
          >
            <!-- <div slot="inputTag">1212</div> -->
          </base-table>
        </div>
      </div>
      <div class="personRight left" v-if="btnTabStatus === 2">
        <ul class="clearfix personHeader">
          <li class="left">
            {{ nowClickTreeRow[0] ? nowClickTreeRow[0].depName : '' }}
          </li>
          <li class="right" v-show="!(nowClickTreeRow[0] && nowClickTreeRow[0].parentId)">
            <span class="button-text" @click="grouphandleCommand('detailAdd', {})">添加子组</span>
            <span class="button-text" @click="grouphandleCommand('detailUpdate', {})">修改名称</span>
            <span class="button-text" @click="grouphandleCommand('detailGetDeptMng', {})">查看管理人员</span>
          </li>
        </ul>
        <ul class="personHandle">
          <li class="peoButton">
            <!-- <el-button size="small" @click="addPeoClick">{{ btnTabStatus === 1 ? '添加部门/成员' : '添加成员' }}</el-button> -->
            <el-button type="warning" plain size="small" @click="addGroupUser">添加成员</el-button>
            <!-- <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 1" @click="setUpLabelClick">{{ btnTabStatus === 1 ? '移出至-标签' : '设置人员标签' }}</el-button>
            <el-button size="small" v-show="btnTabStatus === 0 || btnTabStatus === 2" @click="setUpGroupClick">{{ btnTabStatus === 2 ? '移出至-组' : '设置人员组' }}</el-button> -->
            <el-button type="warning" plain size="small" @click="shiftOutClick">移出</el-button>
          </li>
        </ul>
        <div class="mainTable" v-loading="tableDataLoading || depTreeLoading">
          <base-table
            @handleSelectionChange="handleSelectionChange"
            @handleClickChange="handleClickChange"
            :tableHeight="tableHeight"
            :tableDataList="tableDataList"
            :columns="columns"
            :options="options"
          >
            <!-- <div slot="inputTag">1212</div> -->
          </base-table>
        </div>
      </div>
    </main>
    <common-dialog :dialogVal="dialogVal" @handleClose="handleDepClose" @handleSure="handleDepSure('depruleForm')">
      <div slot="dialogbody" v-if="dialogVal.dialogVisible">
        <el-form :model="depruleForm" :rules="deprules" ref="depruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item :label="btnTabStatus === 0 ? '部门名称' : '组名称'" prop="depName">
            <el-input size="small" v-model="depruleForm.depName"></el-input>
          </el-form-item>
          <el-form-item :label="btnTabStatus === 0 ? '部门描述' : '组描述'" prop="depDesc">
            <el-input size="small" type="textarea" v-model="depruleForm.depDesc"></el-input>
          </el-form-item>
          <el-form-item :label="btnTabStatus === 0 ? '所属部门' : '所属组'" :prop="btnTabStatus === 0 ? 'belongDep' : ''" v-if="pointChangeType === 1">
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
          </el-form-item>
        </el-form>
      </div>
    </common-dialog>
    <common-dialog :dialogVal="getDepMngDialogVal" :width="'70%'" @handleClose="getDepMngClose" :footerShow="false">
      <div slot="dialogbody" v-if="getDepMngDialogVal.dialogVisible">
        <getdep-msg :getDepMsgNeed="getDepMsgNeed"></getdep-msg>
      </div>
    </common-dialog>
    <taggroup-user
      v-if="addTagUserdialogVal.dialogVisible"
      :addTagUserdialogVal="addTagUserdialogVal"
      @handleTagUserClose="handleTagUserClose"
      @handletagUserSure="handletagUserSure"
      :nowClickTagList="nowClickTreeRow[0] && nowClickTreeRow[0].depId ? nowClickTreeRow[0] : depTreeList[0]"
    ></taggroup-user>
    <add-person
      v-if="addPersondialogVal.dialogVisible"
      :departChooseList="departChooseList"
      :addPersondialogVal="addPersondialogVal"
      @addPersonClose="addPersonClose"
      @addPersonSure="addPersonSure"
    ></add-person>
    <depart-change
      v-if="departChangedialogVal.dialogVisible"
      :departChooseList="departChooseList"
      :departChangedialogVal="departChangedialogVal"
      @departChangeHandleClose="departChangeHandleClose"
      @departChangeHandleSure="departChangeHandleSure"
    ></depart-change>
    <set-role
      v-if="setPersonRolesdialogVal.dialogVisible"
      :tableSelectList="tableSelectList"
      :setPersonRolesdialogVal="setPersonRolesdialogVal"
      @setPersonRolesClose="setPersonRolesClose"
      @setPersonRolesSure="setPersonRolesSure"
      :getCheckList="checkList"
    ></set-role>
    <emp-change
      v-if="empChangeVisible"
      @empChangeHandleClose="empChangeHandleClose"
      @empChooseClick="empChooseClick"
      :personDetailInfor="selectRowObj"
      :empChooseList="empChooseList"
      :empChangeVisible="empChangeVisible"
      ref="empChange"
    ></emp-change>
    <person-detail
      v-if="personDetailDialog.dialogVisible"
      :personDetailDialog="personDetailDialog"
      :personDetailObj="personDetailObj"
      :btnTabStatus="btnTabStatus"
      @personDetailHandleClose="personDetailHandleClose"
      @personDetailHandleSure="personDetailHandleSure"
    ></person-detail>
    <!-- <paging :page="page" :pageSize="pageSize" :total="total"></paging> -->
  </div>
</template>

<script lang="ts">
import BaseCommon from '@/assets/mixin/baseCommon'
import getdepMsg from './getDepMng.vue'
import setTager from './setTager.vue'
import empChange from './empChange.vue'
import personDetail from './personDetail.vue'
import { getDepTree, getUserAndDep } from '@/api/common'
import {
  insOrUpdDepList,
  dltDepList,
  getUserDetailList,
  getCrmDepByUserIds,
  insOrDltUserDep,
  createUser,
  getCrmRoleByUserIds,
  insOrDltRoleDep,
  resetPwd,
  insOrDltUserGroup,
  insOrDltUserEmp,
  dltUserList
} from '@/api/admin/departmentPerson'
import { Component, Mixins } from 'vue-property-decorator'
import { DialogType } from '@/types/dialog-type'
import { depruleFormValidate, deprulesValidate } from '@/types/department'
import taggroupUser from './addTagGroupUser.vue'
import addPerson from './addPerson.vue'
import departChange from './departChange.vue'
import setRole from './setPersonRoles.vue'
import { compareArr } from '@/utils/common'
@Component({
  components: {
    getdepMsg,
    setTager,
    taggroupUser,
    addPerson,
    departChange,
    setRole,
    empChange,
    personDetail
  }
})
export default class DepartmentPerson extends Mixins(BaseCommon) {
  // container-header所需参数
  private title: any = {
    iconfont: 'iconfont ytcrm-bumenrenyuan',
    content: '部门人员关系管理'
  }
  private placeholder: string = '人员名称|ID'
  private activeTextColor: string = '#fc923f'
  private seachPlace: string = 'center'
  private seachPlaceHolder: string = '搜索成员、部门'
  private tabList: string[] = ['组织架构', '标签', '小组'] // tree结构的分类
  private tableDataList: any = [] // 表信息
  private tableDataLoading: boolean = false // 表信息
  private columns: any = [
    {
      prop: 'userId',
      label: '用户信息',
      align: 'left',
      width: '120px',
      formatter: (row: any) => {
        return `<span>${row.userId}/${row.userName}</span>`
      }
    },
    {
      prop: 'phoneNum',
      label: '手机号',
      align: 'left',
      minWidth: '120px',
      formatter: (row: any) => {
        return `<span>${row.phoneNum}</span>`
      }
    },
    {
      prop: 'fullDepName',
      label: '主部门信息',
      align: 'left',
      minWidth: '220px',
      showoverflowAndCopy: true,
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span style="display: block;" class="slh">${row.fullDepName}</span>`
      }
    },
    {
      prop: 'pubEmpList',
      label: 'PM4账号关联',
      align: 'left',
      minWidth: '180px',
      showoverflow: true,
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
        let html = ''
        if (row.pubEmpList) {
          for (let index = 0; index < row.pubEmpList.length; index++) {
            const element = row.pubEmpList[index]
            html += `${element.employeeid}/${element.employeename}（${element.opcode}）`
            if (index === row.pubEmpList.length - 1) {
            } else {
              html += '，'
            }
          }
        } else {
          html = '<span style="display: block;text-align:center">--</span>'
        }
        return `<span>${html}</span>`
      }
    },
    {
      prop: 'crmTagList',
      label: '标签信息',
      align: 'left',
      minWidth: '220px',
      showoverflow: true,
      // , column: any, cellValue: any
      formatter: (row: any) => {
        let html = ''
        for (let index = 0; index < row.crmTagList.length; index++) {
          const element = row.crmTagList[index]
          html += element.tagId + '/' + element.tagName
          if (index === row.crmTagList.length - 1) {
          } else {
            html += '，'
          }
        }
        html += ''
        return `<span>${html}</span>`
      }
    },
    {
      prop: 'crmGroupList',
      label: '小组信息',
      align: 'left',
      minWidth: '220px',
      showoverflow: true,
      // , column: any, cellValue: any
      formatter: (row: any) => {
        if (row.crmGroupList.length === 0) {
          return '<span style="text-align: center;display: block;"> -- </span>'
        }
        let html = ''
        for (let index = 0; index < row.crmGroupList.length; index++) {
          const element = row.crmGroupList[index]
          html += element.depId + '/' + element.depName
          if (index === row.crmGroupList.length - 1) {
          } else {
            html += '，'
          }
        }
        html += ''
        return `<span class="slh">${html}</span>`
      }
    },
    {
      prop: 'crmRoleList',
      label: '角色信息',
      align: 'left',
      minWidth: '220px',
      showoverflow: true,
      // , column: any, cellValue: any
      formatter: (row: any) => {
        if (row.crmRoleList.length === 0) {
          return '<span style="text-align: center;display: block;"> -- </span>'
        }
        let html = ''
        for (let index = 0; index < row.crmRoleList.length; index++) {
          const element = row.crmRoleList[index]
          html += element.roleId + '/' + element.roleName
          if (index === row.crmRoleList.length - 1) {
          } else {
            html += '，'
          }
        }
        html += ''
        return `<span class="slh">${html}</span>`
      }
    }
  ]
  private operates: any = {
    width: 120,
    fixed: '',
    initButtonList: [
      {
        id: '1',
        label: '重置密码',
        type: '',
        size: 'mini',
        show: true,
        plain: true,
        disabled: false,
        method: (index: any, row: any) => {
          this.resetPass(row)
        }
      }
    ]
  }
  private seachDeptContent: string = '' // 搜索人员部门绑定值
  private btnTabStatus: number = 0 // 组织架构 + 标签 + 小组切换状态
  private dialogVal: DialogType = {
    dialogVisible: false,
    title: '新建部门'
  } // 弹框参数
  private depTreeLoading: boolean = false
  private depTreeList: any = [] // 组织架构数结构
  private nowClickTreeRow: any = [] // 当前选择的组织架构信息
  private sureParams: any = {} // 确认弹框params值
  private pointChangeType: any = 1 // 当前弹框内容控制 1 点击 “+” 直接添加 2 三个点中添加子部门 3 三个点中修改子部门
  private iTime: any = null // 设置搜索延迟时间防止多次请求
  private crmUserList: any = [] // 组织架构对应搜索 人员信息列表
  private crmDepList: any = [] // 组织架构对应搜索 部门信息列表
  private crmGroupList: any = [] // 组对应搜索 组信息列表
  private crmtagList: any = [] // 标签对应搜索 标签信息列表
  private tagDataList: any = [] // 标签信息列表
  private tagLoading: boolean = true // 标签列表loading
  private tagActiveIndex: number = 0 // 当前点选的标签index
  private nowClickTagList: any = {} // 当前点选的标签信息
  // 组织架构树结构 props
  private treeProps: any = {
    value: 'depId',
    label: 'depName',
    children: 'childList'
  }
  private depruleForm: depruleFormValidate = {
    // 新增组织架构弹框
    depName: '',
    depDesc: '',
    belongDep: ''
  }
  private deprules: deprulesValidate = {
    // 规则
    depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
    depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }],
    belongDep: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
  }
  private chooseBloogDep: any = {} // 选择所属单位
  private getDepMngDialogVal: DialogType = {
    dialogVisible: false,
    title: '查看部门管理人员'
  }
  private getDepMsgNeed: any = [] // 获取部门管理人员
  // 添加标签成员弹框
  private addTagUserdialogVal: DialogType = {
    dialogVisible: false,
    title: '添加组成员信息'
  }
  // 新增人员弹框
  private addPersondialogVal: DialogType = {
    dialogVisible: false,
    title: '新增成员'
  }
  private tableSelectList: any = [] // 选择的人员信息
  // 设置人员所在部门弹框
  private departChangedialogVal: any = {
    dialogVisible: false,
    title: '选择成员所属部门'
  }
  private departChooseList: any = [] // 人员公共部门
  private setPersonRolesdialogVal: any = {
    dialogVisible: false,
    title: '设置人员角色'
  }
  private checkList: any = []
  private empChangeVisible: boolean = false
  private empChooseList: any = []
  private personDetailObj: any = {}
  private personDetailDialog: any = {
    dialogVisible: false,
    title: '查看人员详情信息'
  }
  private selectRowObj: any = {}
  // 详情弹框关闭
  private personDetailHandleClose() {
    this.personDetailDialog.dialogVisible = false
  }
  // 详情弹框确定
  private personDetailHandleSure() {
    this.personDetailDialog.dialogVisible = false
  }
  // 关闭pm4人员关联弹框
  private empChangeHandleClose() {
    this.empChangeVisible = false
  }
  // 确定pm4人员关联弹框
  private empChooseClick(val: any) {
    const addEmpIdList = []
    const dltEmpIdList = []
    if (val.addEmpIdList.length > 0) {
      for (let index = 0; index < val.addEmpIdList.length; index++) {
        const element = val.addEmpIdList[index]
        addEmpIdList.push(element.employeeid)
      }
    }
    if (val.dltEmpIdList.length > 0) {
      for (let index = 0; index < val.dltEmpIdList.length; index++) {
        const element = val.dltEmpIdList[index]
        dltEmpIdList.push(element.employeeid)
      }
    }
    const params = {
      addEmpIdList: addEmpIdList,
      dltEmpIdList: dltEmpIdList,
      userIdList: val.userIdList
    }
    insOrDltUserEmp(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
        this.empChangeVisible = false
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 设置人员角色弹框关闭
  private setPersonRolesClose() {
    this.setPersonRolesdialogVal.dialogVisible = false
  }
  // 设置人员角色弹框 点击确定
  private setPersonRolesSure(val: any) {
    const addRoleIdList = []
    for (let index = 0; index < val.length; index++) {
      const element = val[index]
      addRoleIdList.push(element.roleId)
    }
    const getDel = compareArr(this.checkList, val, true, 'roleId')
    const deleteList = []
    for (let index = 0; index < getDel.length; index++) {
      const element = getDel[index]
      deleteList.push(element.roleId)
    }
    const params = {
      addRoleIdList: addRoleIdList,
      dltRoleIdList: deleteList,
      userIdList: this.tableSelectList
    }
    insOrDltRoleDep(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.setPersonRolesdialogVal.dialogVisible = false
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  private _getCrmRoleByUserIds() {
    console.log(this.tableSelectList)
    const params: any = this.tableSelectList
    getCrmRoleByUserIds(params).then(res => {
      if (res.code === '200') {
        this.checkList = res.data
        this.setPersonRolesdialogVal.dialogVisible = true
      }
    })
  }
  // 确定新增人员弹框
  private addPersonSure(val: any) {
    let userMainDepNum = ''
    let userMainDepName = ''
    const addDepIdList = []
    console.log(val)
    for (let index = 0; index < val.departChooseList.length; index++) {
      const element = val.departChooseList[index]
      if (element.isMain) {
        userMainDepNum = element.depId
        userMainDepName = element.depName
      }
      addDepIdList.push(element.depId)
    }
    const params = {
      userId: val.personForm.userId,
      userCode: val.personForm.userCode,
      userName: val.personForm.userName,
      gender: val.personForm.gender,
      addRoleIdList: val.personForm.roleId,
      phoneNum: val.personForm.phoneNum,
      telNum: val.personForm.telNum,
      userLeaderId: val.personForm.userLeaderId,
      userLeaderName: val.personForm.userLeaderName,
      wxCode: val.personForm.wxCode,
      addDepIdList: addDepIdList,
      userMainDepNum: userMainDepNum,
      userMainDepName: userMainDepName,
      addEmpIdList: val.personForm.pm4PersonConcat
    }
    this._createUser(params)
    // this.addPersondialogVal.dialogVisible = false
  }
  // 取消新增人员
  private addPersonClose() {
    this.addPersondialogVal.dialogVisible = false
  }
  // 关闭设置所在部门弹框
  private departChangeHandleClose() {
    this.departChangedialogVal.dialogVisible = false
  }
  // 确定设置所在部门弹框
  private departChangeHandleSure(val: any) {
    let mainDepId = ''
    const addDepIdList = []
    const dltDepIdList = []
    for (let index = 0; index < val.depList.length; index++) {
      const element = val.depList[index]
      if (element.isMain) {
        mainDepId = element.depId
      }
      addDepIdList.push(element.depId)
    }
    for (let index = 0; index < val.deleteList.length; index++) {
      const element = val.deleteList[index]
      dltDepIdList.push(element.depId)
    }
    const params = {
      addDepIdList: addDepIdList,
      dltDepIdList: dltDepIdList,
      userIdList: this.tableSelectList,
      mainDepId: mainDepId
    }
    this._insOrDltUserDep(params)
  }
  //
  private _insOrDltUserDep(params: any) {
    insOrDltUserDep(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.departChangedialogVal.dialogVisible = false
        this.addTagUserdialogVal.dialogVisible = false
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }

  // 确定添加组人员弹框
  private handletagUserSure(val: any) {
    console.log(val)
    console.log(this.nowClickTreeRow)
    const dltDepIdList = []
    for (let index = 0; index < val.deleteList.length; index++) {
      const element = val.deleteList[index]
      dltDepIdList.push(element.depId)
    }
    const params = {
      addDepIdList: [this.nowClickTreeRow[0].depId],
      dltDepIdList: dltDepIdList,
      userIdList: val.checkedpeople,
      mainDepId: ''
    }
    this._insOrDltUserDep(params)
  }
  // 关闭添加组人员弹框
  private handleTagUserClose() {
    this.addTagUserdialogVal.dialogVisible = false
  }
  // 关闭弹框
  private handleDepClose() {
    this.depruleForm = {
      depName: '',
      depDesc: '',
      belongDep: ''
    }
    this.dialogVal.dialogVisible = false
  }
  private dataFilter(dataList: any, compareVal: any) {
    dataList.filter((item: any) => {
      if (item.depId === compareVal) {
        this.chooseBloogDep = item
        return item.depId === compareVal
      } else {
        if (item.childList && item.childList.length > 0) {
          this.dataFilter(item.childList, compareVal)
        }
      }
    })
  }
  // 所属单位选择
  private belongDepChange(val: any) {
    this.dataFilter(this.depTreeList, val)
    this.sureParams = [
      {
        parentId: this.chooseBloogDep.depId,
        parentCode: this.chooseBloogDep.depCode,
        isDel: 0
      }
    ]
  }
  // 判断是否是空对象
  private isEmptyObject(obj: any) {
    for (const key in obj) {
      return false
    }
    return true
  }
  // 确定弹框
  private handleDepSure(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        let params: any = {}
        if (this.btnTabStatus === 0) {
          params = Object.assign(
            {
              depName: this.depruleForm.depName,
              depDescription: this.depruleForm.depDesc,
              depType: 1
            },
            ...this.sureParams
          )
        } else {
          console.log(this.depruleForm)
          console.log(this.sureParams)
          if (this.isEmptyObject(this.sureParams)) {
            params = Object.assign({
              depName: this.depruleForm.depName,
              depDescription: this.depruleForm.depDesc,
              depType: 2
            })
          } else {
            params = Object.assign(
              {
                depName: this.depruleForm.depName,
                depDescription: this.depruleForm.depDesc,
                depType: 2
              },
              ...this.sureParams
            )
          }
        }
        console.log(params)
        this._insOrUpdDepList([params])
        this.dialogVal.dialogVisible = false
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  // 搜索人员信息
  private seachValueBtn(val: string) {
    console.log(val)
  }
  // 搜索成员、部门信息
  private seachPersonDept(val: any) {
    console.log(val)
    this.$cancelAxios(['getUserAndDep'])
    if (!this.seachDeptContent) {
      return
    }
    clearTimeout(this.iTime)
    this.depTreeLoading = true
    this.iTime = setTimeout(async () => {
      this._getUserAndDep({
        keyword: this.seachDeptContent,
        searchType: this.btnTabStatus
      })
    }, 350)
  }
  private clearPersonDept() {
    this.crmUserList = []
    this.crmDepList = []
    this.crmGroupList = []
    this.crmtagList = []
    if (this.btnTabStatus === 1) {
      this.page = 1
      this._getUserDetailList({
        tagId: this.nowClickTagList[0].tagId,
        pageSize: this.pageSize,
        pageNum: this.page
      })
    } else {
      this.page = 1
      const obj: any = this.$refs.depTree
      obj.setCurrentKey(this.nowClickTreeRow[0].depId)
      this._getUserDetailList({
        depId: this.nowClickTreeRow[0].depId,
        pageSize: this.pageSize,
        pageNum: this.page
      })
    }
  }
  // 搜索人员/部门信息后 点击信息列表
  private personDeptClick(item: any, index: number, type: string) {
    if (!item.active) {
      this.$set(item, 'active', true)
    }
    if (type === 'emp') {
      this.crmUserList.forEach((element: any) => {
        if (element.userId !== item.userId) {
          if (element.active) {
            this.$set(element, 'active', false)
          }
        }
      })
      this.page = 1
      this._getUserDetailList({
        depId: '',
        pageSize: this.pageSize,
        pageNum: this.page,
        userId: item.userId
      })
      // this.onRowClick(item)
    } else if (type === 'dept') {
      this.crmDepList.forEach((element: any) => {
        if (element.depId !== item.depId) {
          if (element.active) {
            this.$set(element, 'active', false)
          }
        }
      })
      this.departListClick(item, {}, {})
    } else if (type === 'group') {
      this.crmGroupList.forEach((element: any) => {
        if (element.depId !== item.depId) {
          if (element.active) {
            this.$set(element, 'active', false)
          }
        }
      })
      this.departListClick(item, {}, {})
    } else if (type === 'tag') {
      this.crmtagList.forEach((element: any) => {
        if (element.tagId !== item.tagId) {
          if (element.active) {
            this.$set(element, 'active', false)
          }
        }
      })
      this.nowClickTagList = [item]
      this.page = 1
      this._getUserDetailList({
        tagId: item.tagId,
        pageSize: this.pageSize,
        pageNum: this.page
      })
    }
  }
  // 下拉菜单显示与隐藏的时候 设置当前操作树节点样式
  private visibleChange(isVisible: boolean, refsValue: any) {
    const obj: any = this.$refs[refsValue]
    if (!isVisible) {
      obj.$el.style.display = 'none'
      obj.$el.parentNode.parentNode.style.background = '#fff'
    } else {
      obj.$el.style.display = 'block'
      obj.$el.parentNode.parentNode.style.background = '#f5f7fa'
    }
  }
  // 点击三个点的时候 当前树节点样式改变
  private depChangeClick(val: any, e: any) {
    console.log(val)
    e.target.parentNode.parentNode.style.display = 'block'
    e.target.parentNode.parentNode.parentNode.parentNode.style.background = '#f5f7fa'
  }
  // 根据关键字查询人员、标签信息、部门信息
  private _getUserAndDep(params: any) {
    getUserAndDep(params).then((res: any) => {
      if (res.code === '200') {
        this.depTreeLoading = false
        if (this.btnTabStatus === 0) {
          this.crmDepList = res.data.crmDepList
          this.crmUserList = res.data.crmUserList
          if (this.crmUserList.length === 0 && this.crmDepList.length > 0) {
            this.personDeptClick(this.crmDepList[0], 0, 'dept')
          } else if (this.crmUserList.length > 0) {
            this.personDeptClick(this.crmUserList[0], 0, 'emp')
          }
        }
        if (this.btnTabStatus === 1) {
          this.crmtagList = res.data.crmUsertagDOList
          if (this.crmGroupList.length) {
            this.personDeptClick(this.crmtagList[0], 0, 'tag')
          }
        }
        if (this.btnTabStatus === 2) {
          this.crmGroupList = res.data.crmDepGroupList
          if (this.crmGroupList.length) {
            this.personDeptClick(this.crmGroupList[0], 0, 'group')
          }
        }
      } else {
        this.depTreeLoading = false
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 获取组织架构tree信息
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
        this.nowClickTreeRow = res.data
        if (params.treeType === 2 && res.data.length > 0) {
          this.nowClickTreeRow = [res.data[0]]
        }
        this.$nextTick(() => {
          const obj: any = this.$refs.depTree
          if (res.data.length > 0) {
            obj.setCurrentKey(res.data[0].depId)
          }
          this.page = 1
          this._getUserDetailList({
            depId: res.data[0].depId,
            pageSize: this.pageSize,
            pageNum: this.page
          })
        })
      } else {
        this.depTreeLoading = false
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 新增或修改组织架构或者组信息
  private _insOrUpdDepList(params: any) {
    insOrUpdDepList(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.chooseBloogDep = {}
        this.depruleForm = {
          depName: '',
          depDesc: '',
          belongDep: ''
        }
        this._getDepTree({
          treeType: params[0].depType
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  private _dltDepList(params: any, treeType: any = 1) {
    dltDepList(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this._getDepTree({
          treeType: treeType
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 点击树结构每一行
  private departListClick(data: any, node: any, item: any) {
    this.nowClickTreeRow = [data]
    this.page = 1
    this._getUserDetailList({
      depId: data.depId,
      pageSize: this.pageSize,
      pageNum: this.page
    })
    console.log(data)
    console.log(node)
    console.log(item)
  }
  // 直接添加部门 可添加根目录
  private deptAddClick() {
    if (this.btnTabStatus === 1) {
      ;(this.$refs.setTag as any).addTag()
      return
    }
    if (this.btnTabStatus === 2) {
      this.dialogVal = {
        dialogVisible: true,
        title: '新建组'
      }
    } else {
      this.dialogVal.dialogVisible = true
    }
    this.deprules = {
      // 规则
      depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }],
      belongDep: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
    }
    this.pointChangeType = 1
    console.log('直接添加部门，标签，或者小组 部门可多个根目录')
  }
  // 点击三个点 对组织架构进行操作
  private handleCommand(val: string, data: any) {
    let params: any = []
    switch (val) {
      case 'delete':
        params = [data.depId]
        this._dltDepList(params)
        break
      case 'add':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        console.log(data)
        this.sureParams = [
          {
            depType: 1,
            parentId: data.depId,
            parentCode: data.depCode,
            isDel: 0
          }
        ]
        this.pointChangeType = 2
        this.dialogVal.dialogVisible = true
        break
      case 'update':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        console.log(data)
        this.depruleForm = {
          depName: data.depName,
          depDesc: data.depDescription
        }
        this.sureParams = [
          {
            depId: data.depId,
            depType: 1,
            isDel: 0
          }
        ]
        this.pointChangeType = 3
        this.dialogVal.dialogVisible = true
        break
      case 'detailAdd':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        this.sureParams = [
          {
            depType: 1,
            parentId: this.nowClickTreeRow[0].depId,
            parentCode: this.nowClickTreeRow[0].depCode,
            isDel: 0
          }
        ]
        this.pointChangeType = 2
        this.dialogVal.dialogVisible = true
        break
      case 'detailUpdate':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        this.sureParams = [
          {
            depId: this.nowClickTreeRow[0].depId,
            depType: 1,
            isDel: 0
          }
        ]
        this.depruleForm.depDesc = this.nowClickTreeRow.length > 0 ? this.nowClickTreeRow[0].depDescription : this.nowClickTreeRow.depDescription
        this.depruleForm.depName = this.nowClickTreeRow.length > 0 ? this.nowClickTreeRow[0].depName : this.nowClickTreeRow.depName
        this.pointChangeType = 3
        this.dialogVal.dialogVisible = true
        break
      case 'getDeptMng':
        this.getDepMsgNeed = [data]
        this.getDepMngDialogVal.dialogVisible = true
        break
      case 'detailGetDeptMng':
        this.getDepMsgNeed = this.nowClickTreeRow
        this.getDepMngDialogVal.dialogVisible = true
        break
      default:
        break
    }
  }
  // 点击三个点 对组结构进行操作
  private grouphandleCommand(val: string, data: any) {
    console.log(data)
    let params: any = []
    switch (val) {
      case 'delete':
        params = [data.depId]
        this._dltDepList(params, 2)
        break
      case 'add':
        this.deprules = {
          depName: [{ required: true, message: '请输入组名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入组描述', trigger: 'blur' }]
        }
        console.log(data)
        this.sureParams = [
          {
            depType: 1,
            parentId: data.depId,
            parentCode: data.depCode,
            isDel: 0
          }
        ]
        this.pointChangeType = 2
        this.dialogVal.dialogVisible = true
        break
      case 'update':
        this.deprules = {
          depName: [{ required: true, message: '请输入组名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入组描述', trigger: 'blur' }]
        }
        console.log(data)
        this.depruleForm = {
          depName: data.depName,
          depDesc: data.depDescription
        }
        this.sureParams = [
          {
            depId: data.depId,
            depType: 1,
            isDel: 0
          }
        ]
        this.pointChangeType = 3
        this.dialogVal.dialogVisible = true
        break
      case 'detailAdd':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        this.sureParams = [
          {
            depType: 1,
            parentId: this.nowClickTreeRow[0].depId,
            parentCode: this.nowClickTreeRow[0].depCode,
            isDel: 0
          }
        ]
        this.pointChangeType = 2
        this.dialogVal.dialogVisible = true
        break
      case 'detailUpdate':
        this.deprules = {
          depName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          depDesc: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
        }
        this.sureParams = [
          {
            depId: this.nowClickTreeRow[0].depId,
            depType: 1,
            isDel: 0
          }
        ]
        this.depruleForm.depDesc = this.nowClickTreeRow.length > 0 ? this.nowClickTreeRow[0].depDescription : this.nowClickTreeRow.depDescription
        this.depruleForm.depName = this.nowClickTreeRow.length > 0 ? this.nowClickTreeRow[0].depName : this.nowClickTreeRow.depName
        this.pointChangeType = 3
        this.dialogVal.dialogVisible = true
        break
      case 'getDeptMng':
        this.getDepMsgNeed = [data]
        this.getDepMngDialogVal.dialogVisible = true
        break
      case 'detailGetDeptMng':
        this.getDepMsgNeed = this.nowClickTreeRow
        this.getDepMngDialogVal.dialogVisible = true
        break
      default:
        break
    }
  }
  // 添加小组成员
  private addGroupUser() {
    this.addTagUserdialogVal.dialogVisible = true
  }
  // 关闭部门管理人员弹框
  private getDepMngClose() {
    this.getDepMngDialogVal.dialogVisible = false
  }
  // 标签小组详情
  private labelDetail() {
    console.log(this.btnTabStatus)
  }
  // 切换组织架构 标签 小组
  private btnTabClick(nowTab: number) {
    this.btnTabStatus = nowTab
    switch (nowTab) {
      case 0:
        this.tableSelectList = []
        this.seachDeptContent = ''
        this.seachPlaceHolder = '搜索成员、部门'
        this.$cancelAxios(['getDepTree', 'getUserAndDep'])
        this._getDepTree()
        break
      case 1:
        this.tableSelectList = []
        this.seachDeptContent = ''
        this.$cancelAxios(['getDepTree', 'getUserAndDep'])
        this.tagDataList = []
        this.tagLoading = true
        this.tagActiveIndex = 0
        this.seachPlaceHolder = '搜索标签'
        break
      case 2:
        this.tableSelectList = []
        this.seachDeptContent = ''
        this.seachPlaceHolder = '搜索小组'
        this.$cancelAxios(['getDepTree'])
        this._getDepTree({
          treeType: 2
        })
        break
      default:
        break
    }
    console.log('切换组织架构 标签 小组')
  }
  // 获取tagList
  private getTagList(val: any) {
    this.tagDataList = val
    this.nowClickTagList = val[0]
    if (val.length > 0) {
      this._getUserDetailList({
        tagId: val[0].tagId,
        pageSize: this.pageSize,
        pageNum: this.page
      })
      this.tagLoading = false
    }
  }
  // 获取tagList
  private getUserDetail(tabId: any) {
    this.page = 1
    this._getUserDetailList({
      tagId: tabId,
      pageSize: this.pageSize,
      pageNum: this.page
    })
    this.tagLoading = false
  }
  // 点选tag列表查询人员信息
  private tagClick(item: any, index: number) {
    this.tagActiveIndex = index
    this.page = 1
    this._getUserDetailList({
      tagId: item.tagId,
      pageSize: this.pageSize,
      pageNum: this.page
    })
    this.nowClickTagList = item
    console.log(item)
    console.log(index)
  }
  // 点击新增成员按钮
  private addPeoClick() {
    console.log(this.addPersondialogVal)
    this.departChooseList = [
      {
        depId: this.nowClickTreeRow[0].depId,
        depName: this.nowClickTreeRow[0].depName,
        isMain: true
      }
    ]
    this.addPersondialogVal.dialogVisible = true
  }
  // 设置所在部门
  private setUpDepartmentClick() {
    this.departChooseList = []
    console.log('设置所在部门')
    if (this.tableSelectList.length === 0) {
      this.$message({
        message: '请选择人员信息',
        type: 'warning'
      })
      return
    }
    this._getCrmDepByUserIds(this.tableSelectList)
  }
  // 设置关联人员信息
  private setUpEmpClick() {
    console.log('设置关联人员信息')
    if (this.tableSelectList.length !== 1) {
      this.$message({
        message: '设置PM4人员关联有且只能选择一条人员信息',
        type: 'warning'
      })
      return
    }
    this.empChooseList = this.tableSelectList[0].empList
    this.empChangeVisible = true
    console.log(this.tableSelectList)
  }
  // 设置人员角色
  private setUpRoleClick() {
    if (this.tableSelectList.length === 0) {
      this.$message({
        message: '请选择人员信息',
        type: 'warning'
      })
      return
    }
    this._getCrmRoleByUserIds()
    console.log('设置人员角色')
  }
  // 设置人员标签
  private setUpLabelClick() {
    console.log('设置人员标签')
  }
  // 设置人员组信息
  private setUpGroupClick() {
    console.log('设置人员组信息')
  }
  // 点击删除 可批量
  private deletePeoClick() {
    if (this.tableSelectList.length === 0) {
      this.$message({
        message: '请选择人员信息',
        type: 'warning'
      })
    }
    const params = {
      userId: this.tableSelectList
    }
    dltUserList(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 小组点击移出 可批量
  private shiftOutClick() {
    const params = {
      depId: this.nowClickTreeRow[0].depId,
      dltUserIdList: this.tableSelectList,
      addUserIdList: []
    }
    insOrDltUserGroup(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
    console.log('移出')
  }
  // 获取人员基本信息
  private _getUserDetailList(params: any, oneLineClick: boolean = false) {
    if (!oneLineClick) {
      this.tableDataLoading = true
    }
    getUserDetailList(params).then(res => {
      if (res.code === '200') {
        if (oneLineClick) {
          this.personDetailObj = res.data.list[0]
          return
        }
        this.tableDataLoading = false
        this.tableDataList = res.data.list
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
        this.tableDataLoading = false
      }
    })
  }
  // 根据所选人员获取共有的部门关系信息
  private _getCrmDepByUserIds(params: any) {
    getCrmDepByUserIds(params).then(res => {
      if (res.code === '200') {
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index]
          this.departChooseList.push({
            depId: element.depId,
            depName: element.depName,
            isMain: element.mainDepFlag
          })
        }
        this.departChangedialogVal.dialogVisible = true
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 创建人员
  private _createUser(params: any) {
    createUser(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.addPersondialogVal.dialogVisible = false
        this.page = 1
        this._getUserDetailList({
          depId: this.nowClickTreeRow[0].depId,
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 表格选择数据
  private handleSelectionChange(val: any) {
    this.selectRowObj = val.row
    this.tableSelectList = []
    for (let index = 0; index < val.selection.length; index++) {
      const element = val.selection[index]
      this.tableSelectList.push(element.userId)
    }
  }
  // 点击人员信息行 组织架构
  private handleClickChange(val: any) {
    this.personDetailDialog.dialogVisible = true
    this.page = 1
    this._getUserDetailList(
      {
        userId: val.row.userId,
        pageSize: this.pageSize,
        pageNum: this.page
      },
      true
    )
  }
  // 重置密码
  private resetPass(row: any) {
    console.log(row)
    const params = {
      userId: +row.userId
    }
    resetPwd(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  mounted() {
    this.tagActiveIndex = 0
    this._getDepTree()
  }
}
</script>

<style lang="scss" scoped>
.departmentPerson {
  position: relative;
  width: 100%;
  height: 100%;
  main {
    padding: 5px 20px;
    height: calc(100% - 56px);
    .deptLeft {
      width: 260px;
      height: 100%;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .deptHeader {
        padding: 10px;
        .deptSeach {
          width: calc(100% - 30px);
        }
        .deptAdd {
          width: 30px;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
        }
      }
      .buttonTab {
        padding: 0px 10px 10px;
        border-bottom: 1px solid #eee;
      }
      .depTree {
        height: calc(100% - 99px);
        padding: 10px 0px 0px;
        overflow: auto;
        .el-tree {
          height: 100%;
          .custom-tree-node {
            font-size: 14px;
          }
        }
        .personDepartContent {
          .personDepartHeader {
            text-indent: 10px;
            color: #787878;
            height: 30px;
            line-height: 30px;
            font-size: 13px;
          }
          .persondeptList {
            text-indent: 10px;
            height: 30px;
            line-height: 30px;
            font-size: 13px;
            &:hover {
              background-color: #f0f7ff;
            }
          }
          .empInfor {
            width: 46%;
            float: left;
            padding-right: 7px;
          }
          .deptInfor {
            font-size: 12px;
            overflow: hidden;
            zoom: 1;
            display: block;
            color: #7e7e7e;
            text-align: right;
          }
          .active {
            background-color: #ecf5ff;
            color: #409eff;
            border-radius: 4px;
          }
        }
        .tagListItem {
          position: relative;
          padding: 0 20px;
          line-height: 26px;
          height: 26px;
          background: 0 0;
          overflow: hidden;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          &:hover {
            background: #f2f6fc;
          }
          &.active {
            color: #fc923f;
            background-color: #f0f7ff;
          }
        }
      }
    }
    .personRight {
      width: calc(100% - 261px);
      position: relative;
      height: 100%;
      margin-left: 1px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
      .mainTable {
        padding: 0px 15px;
        height: calc(100% - 148px);
      }
    }
  }
  .el-cascader--small {
    width: 100%;
  }
}
</style>
