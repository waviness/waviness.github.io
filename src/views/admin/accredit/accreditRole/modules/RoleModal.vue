<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    class="admin"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称">
          <a-input placeholder="请输入角色名称" v-decorator.trim="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="英文名称">
          <a-input placeholder="请输入角色英文名称" v-decorator.trim="[ 'roleKeyword', validatorRules.roleKeyword]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色描述">
          <a-input placeholder="请输入角色描述" v-decorator.trim="[ 'roleDescription', validatorRules.roleDescription]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createRole, updateRole } from '@/api/admin'

@Component
export default class RoleModal extends Vue {
  private title: string = '操作'
  private visible: boolean = false
  private labelCol: any = {
    xs: { span: 24 },
    sm: { span: 5 }
  }
  private roleId: number = -1
  private roleType: number = -1
  private wrapperCol: any = {
    xs: { span: 24 },
    sm: { span: 16 }
  }
  private confirmLoading: boolean = false
  private form: any
  get validatorRules() {
    return {
      roleName: { rules: [{ required: true, message: '请输入角色名称!' }] },
      roleKeyword: { rules: [{ required: true, message: '请输入英文名称!' }] },
      roleDescription: { rules: [{ required: false, message: '请输入角色描述!' }] }
    }
  }
  created() {
    this.form = this.$form.createForm(this)
  }
  private handleCancel () {
    this.close()
  }
  private close() {
    this.visible = false
  }
  private edit(record: any) {
    this.form.resetFields()
    this.visible = true
    if (record && record.roleId) {
      const {
        roleName,
        roleKeyword,
        roleDescription
      } = record
      this.$nextTick(() => {
        this.form.setFieldsValue({ roleName, roleKeyword, roleDescription })
        this.roleId = record.roleId
      })
    }
  }
  private handleOk() {
    // 触发表单验证
    this.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.confirmLoading = true
        const formData = Object.assign({}, values)
        formData.roleType = this.roleType
        if (this.roleId && this.roleId !== -1) {
          formData.roleId = this.roleId
        }
        const res: any = this.roleId && this.roleId !== -1 ? await updateRole(formData) : await createRole(formData)
        this.confirmLoading = false
        if (res.success) {
          this.$emit('ok')
          this.close()
          this.$message.success('更新成功')
        } else {
          this.$message.warning(res.msg || '更新失败')
        }
      }
    })
  }
}
</script>

<style scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>
