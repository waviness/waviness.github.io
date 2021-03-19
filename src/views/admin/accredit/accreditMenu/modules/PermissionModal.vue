<template>
  <a-drawer :title="title" :width="drawerWidth" @close="handleCancel" :visible="visible" :confirmLoading="confirmLoading">
    <div :style="{ width: '100%', border: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff' }">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-model="pmsType" :disabled="disableSubmit">
              <a-radio :value="2">目录</a-radio>
              <a-radio :value="3">菜单</a-radio>
              <a-radio :value="4">按钮</a-radio>
              <a-radio :value="1">数据权限</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
            <a-input placeholder="请输入名称" v-decorator="['pmsName', validatorRules.pmsName]" :readOnly="disableSubmit" />
          </a-form-item>

          <!-- <a-form-item v-if="parentName" label="上级菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span>{{ parentName }}</span>
          </a-form-item> -->

          <a-form-item
            v-if="parentName"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="true">
            <span slot="help">{{ validateStatus=='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeData"
              v-model="parentId"
              placeholder="请选择父级菜单"
              :disabled="disableSubmit"
              @change="handleParentIdChange">
            </a-tree-select>
          </a-form-item>

          <a-form-item label="英文名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
            <a-input placeholder="请输入英文名称" v-decorator="['keyword', validatorRules.keyword]" :readOnly="disableSubmit" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单路径">
            <a-input placeholder="请输入菜单路径" v-decorator="['path', validatorRules.path]" :readOnly="disableSubmit" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图标">
            <a-input placeholder="请输入图标" v-decorator="['icon', validatorRules.icon]" :readOnly="disableSubmit" />
          </a-form-item>

          <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入描述" v-decorator="['pmsDescription', validatorRules.pmsDescription]" :readOnly="disableSubmit" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number placeholder="请输入排序" style="width: 200px" v-decorator="['orderNum', validatorRules.orderNum]" :disabled="disableSubmit" />
          </a-form-item>
        </a-form>
      </a-spin>
      <a-row :style="{ textAlign: 'right' }">
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel">关闭</a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addMenu, updateMenu, queryMenuList } from '@/api/admin'

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol: any = {
  xs: { span: 24 },
  sm: { span: 16 }
}

@Component
export default class PermissionModal extends Vue {
  private drawerWidth: number = 700
  private title: string = '操作'
  private pmsId: number = -1
  private treeData: any = []
  private validateStatus: string = ''
  private parentId: number = -1
  private parentName: string = ''
  private plantformType: number = -1
  private isCreate: boolean = false
  private disableSubmit: boolean = false
  private visible: boolean = false
  private pmsType: number = -1 // 菜单类型
  private labelCol: any = labelCol
  private wrapperCol: any = wrapperCol
  private confirmLoading: boolean = false
  private form: any
  get validatorRules() {
    return {
      pmsName: { rules: [{ required: true, message: '请输入菜单名称!' }] },
      keyword: { rules: [{ required: true, message: '请输入菜单英文名称!' }] },
      path: { rules: [{ required: false, message: '请输入菜单路径!' }] },
      icon: { rules: [{ required: false, message: '请输入菜单图标!' }] },
      pmsDescription: { rules: [{ required: false, message: '请输入菜单描述!' }] },
      orderNum: { initialValue: 1.0 }
    }
  }
  created() {
    this.form = this.$form.createForm(this)
  }
  // 根据屏幕变化,设置抽屉尺寸
  private resetScreenSize() {
    const screenWidth = document.body.clientWidth
    if (screenWidth < 500) {
      this.drawerWidth = screenWidth
    } else {
      this.drawerWidth = 700
    }
  }
  private async loadTree() {
    const res: any = await queryMenuList({ plantformType: this.plantformType })
    if (res.success) {
      this.treeData = res.data || []
      this.setName(this.treeData)
    }
  }
  private setName(treeData: any) {
    treeData.forEach((element: any) => {
      element.key = element.pmsId
      element.title = element.pmsName
      element.value = element.pmsId
      if (element.pmsName === this.form.getFieldValue('pmsName')) {
        element.disabled = true
      }
      if (element.children) {
        this.setName(element.children)
      }
    })
  }
  private edit(model: any) {
    this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
    this.form.resetFields()
    this.visible = true
    this.parentId = model.parentId
    this.parentName = model.parentName
    if (model && model.pmsId) {
      const {
        pmsName,
        keyword,
        path,
        icon,
        pmsDescription,
        orderNum
      } = model
      this.$nextTick(() => {
        this.form.setFieldsValue({ pmsName, keyword, path, icon, pmsDescription, orderNum })
        this.pmsId = model.pmsId
      })
    }
    this.loadTree()
  }
  private close() {
    this.$emit('close')
    this.disableSubmit = false
    this.visible = false
  }
  private handleCancel() {
    this.close()
  }
  private handleParentIdChange(value: any) {
    if (!value) {
      this.validateStatus = 'error'
    } else {
      this.validateStatus = 'success'
    }
  }
  private handleOk() {
    // 触发表单验证
    this.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const formData = Object.assign({}, values)
        if (this.pmsId && this.pmsId !== -1) {
          formData.pmsId = this.pmsId
        }
        formData.parentId = this.parentId
        formData.parentName = this.parentName
        formData.pmsType = this.pmsType
        formData.plantformType = this.plantformType
        if (formData.parentId === -1) {
          this.validateStatus = 'error'
          this.$message.error('请检查你填的类型以及信息是否正确！')
          return
        } else {
          this.validateStatus = 'success'
        }
        this.confirmLoading = true
        const res: any = this.pmsId && !this.isCreate ? await updateMenu(formData) : await addMenu(formData)
        this.confirmLoading = false
        if (res.success) {
          this.$emit('ok')
          this.$message.success('菜单更新成功')
        } else {
          this.$message.warning(res.msg || '更新失败')
        }
        this.close()
      }
    })
  }
}
</script>

<style scoped>
</style>
