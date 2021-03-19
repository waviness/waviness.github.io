<template>
  <div class="personDetail">
    <common-dialog :dialogVal="personDetailDialog" :width="'50%'" @handleClose="personDetailHandleClose" @handleSure="personDetailHandleSure">
      <div slot="dialogbody">
        <div class="editOrSeePerson">
          <ul class="addPersonHeader">
            <li class="infor">
              <span class="empName">{{ personDetailObj.userCode }}</span>
              <i class="el-icon-s-custom" :class="personDetailObj.gender === 1 ? 'man' : 'woman'"></i>
            </li>
            <li class="wxInfor">
              <span class="title">微信号：</span>
              <span class="value">{{ personDetailObj.wxCode }}</span>
            </li>
            <li class="operate" v-show="btnTabStatus === 0">
              <span @click="editingClick">编辑</span>
            </li>
          </ul>
          <ul class="otherInfor">
            <li>
              <span class="title">真实姓名：</span>
              <span class="value">
                {{ personDetailObj.userName }}
              </span>
            </li>
            <li>
              <span class="title">手机号：</span>
              <span class="value">
                {{ personDetailObj.phoneNum }}
              </span>
            </li>
            <li>
              <span class="title">邮箱：</span>
              <span class="value">
                {{ personDetailObj.emailAddress }}
              </span>
            </li>
            <li class="clearfix">
              <span class="title" style="line-height: 25px">部门：</span>
              <span class="value departInforShow left" v-for="(item, index) in personDetailObj.crmDepList" :key="index">
                {{ item.depId }} / {{ item.depName }}
                <i v-if="item.depId === personDetailObj.userMainDepNum">主</i>
              </span>
              <span style="color: #AAA;line-height: 25px" v-show="!personDetailObj.crmDepList || personDetailObj.crmDepList.length === 0">
                暂无部门信息
              </span>
            </li>
            <li class="clearfix">
              <span class="title" style="line-height: 25px">标签：</span>
              <span v-show="personDetailObj.crmTagList && personDetailObj.crmTagList.length > 0" class="value departInforShow left" v-for="(item, index) in personDetailObj.crmTagList" :key="index">
                {{ item.tagId }}/{{ item.tagName }}
              </span>
              <span style="color: #AAA;line-height: 25px" v-show="!personDetailObj.crmTagList || personDetailObj.crmTagList.length === 0">
                暂无标签信息
              </span>
            </li>
            <li class="clearfix">
              <span class="title" style="line-height: 25px">关联人员：</span>
              <span v-show="personDetailObj.pubEmpList && personDetailObj.pubEmpList.length > 0" class="value departInforShow left" v-for="(item, index) in personDetailObj.pubEmpList" :key="index">
                {{ item.employeeid }}/{{ item.employeename }}
              </span>
              <span style="color: #AAA;line-height: 25px" v-show="!personDetailObj.pubEmpList || personDetailObj.pubEmpList.length === 0">
                暂无人员关联信息
              </span>
            </li>
            <li class="clearfix">
              <span class="title" style="line-height: 25px">角色信息：</span>
              <span v-show="personDetailObj.crmRoleList && personDetailObj.crmRoleList.length > 0" class="value departInforShow left" v-for="(item, index) in personDetailObj.crmRoleList" :key="index">
                {{ item.roleId }}/{{ item.roleName }}
              </span>
              <span style="color: #AAA;line-height: 25px" v-show="!personDetailObj.crmRoleList || personDetailObj.crmRoleList.length === 0">
                暂无角色信息
              </span>
            </li>
          </ul>
        </div>
      </div>
    </common-dialog>
    <add-person
      v-if="editingPersondialogVal.dialogVisible"
      :departChooseList="departChooseList"
      :addPersondialogVal="editingPersondialogVal"
      :editingUserDetail="personDetailObj"
      @addPersonClose="editingPersonClose"
      @addPersonSure="editingPersonSure"
    ></add-person>
  </div>
</template>

<script lang="ts">
import addPerson from './addPerson.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import commonDialog from '@/components/commonDialog/index.vue'
import { DialogType } from '@/types/dialog-type'
import { editUser } from '@/api/admin/departmentPerson'
@Component({
  components: {
    commonDialog,
    addPerson
  }
})
export default class PersonDetail extends Vue {
  @Prop() personDetailDialog!: any
  @Prop() personDetailObj!: any
  @Prop({ type: Number, default: 0 }) btnTabStatus!: number
  private departChooseList: any = []
  // 编辑人员弹框
  private editingPersondialogVal: DialogType = {
    dialogVisible: false,
    title: '编辑成员'
  }
  private personDetailHandleClose() {
    this.$emit('personDetailHandleClose')
  }
  private personDetailHandleSure() {
    this.$emit('personDetailHandleSure')
  }
  private editingClick() {
    this.editingPersondialogVal.dialogVisible = true
    console.log('editing')
  }
  private editingPersonClose() {
    this.editingPersondialogVal.dialogVisible = false
  }
  private editingPersonSure(val: any) {
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
    this._editUser(params)
  }
  // 编辑用户
  private _editUser(params: any) {
    editUser(params).then(res => {
      if (res.code === '200') {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.editingPersondialogVal.dialogVisible = false
        this.personDetailHandleClose()
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  mounted() {
    console.log(this.personDetailObj)
  }
}
</script>

<style lang="scss" scoped>
.personDetail {
  .editOrSeePerson {
    .departInforShow {
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
    .addPersonHeader {
      padding-bottom: 10px;
      border-bottom: 1px dashed #e4e6e9;
      position: relative;
      .operate {
        position: absolute;
        right: 10px;
        top: 10px;
        line-height: 20px;
        span {
          color: #0c4c7f;
          padding: 0px 8px;
          cursor: pointer;
          &:hover {
            font-weight: 700;
          }
        }
      }
      .infor {
        padding: 10px 0px;
        .empName {
          font-size: 18px;
          color: #000;
        }
        .el-icon-s-custom {
          padding: 0px 10px;
        }
        .man {
          color: #409eff;
        }
        .woman {
          color: #f56c6c;
        }
      }
      .wxInfor {
        font-size: 13px;
        margin-top: 2px;
        color: #787878;
      }
    }
    .otherInfor {
      padding-bottom: 15px;
      li {
        margin-top: 20px;
        line-height: 18px;
        font-size: 14px;
      }
      .title {
        width: 75px;
        display: table-cell;
        vertical-align: top;
        color: #787878;
        text-align: right;
        float: left;
      }
      .value {
        padding-left: 3px;
        color: #000;
      }
    }
  }
}
</style>
