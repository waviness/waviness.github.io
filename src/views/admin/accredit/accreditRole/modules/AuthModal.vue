<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width=650
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto;padding-bottom: 53px;">
    <a-tabs v-model="type" @change="loadData">
      <a-tab-pane v-for="item in plantformTypeList" :key="item.DIC_SELECT_ID" :tab="item.DIC_SELECT_NAME" />
    </a-tabs>

    <a-form>
      <a-form-item label='所拥有的权限'>
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onCheck"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly">
        </a-tree>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit(true)" type="primary" :loading="loading">保存并关闭</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { queryMenuList, updateRole, getRoleInfo } from '@/api/admin'
import { getDictionaries } from '@/api/admin/dictionary'

@Component
export default class AuthModal extends Vue {
  private plantformTypeList: any = []
  private type: string = '' // 平台类型
  private roleId: string = ''
  private title: string = '角色权限配置'
  private model: any = {}
  private treeData: any = []
  private visible: boolean = false
  private allTreeKeys: any = []
  private expandedKeysss: any = []
  private checkedKeys: any = []
  private defaultCheckedKeys: any = []
  private loading: boolean = false
  private checkStrictly: boolean = false
  private checkedKeysResult: any = []
  private roleTree: any = []
  private roleTreeLeaf: any = []
  created() {
    this.getPlatformTypes()
  }
  private async getPlatformTypes() {
    const res = await getDictionaries({
      pageNum: 1,
      pageSize: 20,
      typeId: 8
    })
    this.plantformTypeList = res.data.list
    this.type = this.plantformTypeList[0].DIC_SELECT_ID
  }
  private async show(model: any) {
    this.roleId = model.roleId
    this.model = model
    this.visible = true
    await this.loadData()
    await this.getRoleInfoById()
  }
  private async getRoleInfoById() {
    const res: any = await getRoleInfo({ roleId: this.roleId })
    this.roleTree = []
    this.roleTreeLeaf = []
    this.getTreeIds(res.data.pmsTree)
    this.getTreeLeafIds(res.data.pmsTree)
    this.checkedKeysResult = [...this.roleTree]
    this.checkedKeys = [...this.roleTreeLeaf]
    this.defaultCheckedKeys = [...this.roleTreeLeaf]
    this.expandedKeysss = this.allTreeKeys
  }
  private getTreeIds(treeData: any) {
    treeData.forEach((element: any) => {
      this.roleTree.push(element.pmsId)
      if (element.children) {
        this.getTreeIds(element.children)
      }
    })
  }
  private getTreeLeafIds(treeData: any) {
    treeData.forEach((element: any) => {
      if (!element.children) {
        this.roleTreeLeaf.push(element.pmsId)
      } else {
        this.getTreeLeafIds(element.children)
      }
    })
  }
  private reset() {
    this.expandedKeysss = []
    this.checkedKeys = []
    this.checkedKeysResult = []
    this.defaultCheckedKeys = []
    this.loading = false
  }
  private close() {
    this.reset()
    this.$emit('close')
    this.visible = false
  }
  private checkALL () {
    this.checkedKeys = this.allTreeKeys
    this.checkedKeysResult = this.allTreeKeys
  }
  private cancelCheckALL () {
    this.checkedKeys = []
    this.checkedKeysResult = []
  }
  private expandAll () {
    this.expandedKeysss = this.allTreeKeys
  }
  private closeAll () {
    this.expandedKeysss = []
  }
  private switchCheckStrictly(v: number) {
    if (v === 1) {
      this.checkStrictly = false
    } else if (v === 2) {
      this.checkStrictly = true
    }
  }
  private onCheck (o: any, e: any) {
    if (this.checkStrictly) {
      this.checkedKeys = o.checked
    } else {
      this.checkedKeys = o
    }
    this.checkedKeysResult = [...o, ...e.halfCheckedKeys]
  }
  private onExpand(expandedKeys: any) {
    this.expandedKeysss = expandedKeys
  }
  private async handleSubmit() {
    const params = {
      roleId: this.roleId,
      roleName: this.model.roleName,
      roleKeyword: this.model.roleKeyword,
      resList: this.checkedKeysResult
    }
    this.loading = true
    console.log('请求参数：', params)
    const res: any = await updateRole(params)
    this.loading = false
    if (res.success) {
      this.$message.success('更新成功')
    } else {
      this.$message.warning(res.msg || '更新失败')
    }
    this.close()
  }
  private async loadData() {
    const res: any = await queryMenuList({ plantformType: this.type })
    this.treeData = res.data || []
    this.allTreeKeys = []
    this.setName(this.treeData)
  }
  private setName(treeData: any) {
    treeData.forEach((element: any) => {
      this.allTreeKeys.push(element.pmsId)
      element.key = element.pmsId
      element.title = element.pmsName
      if (element.children) {
        this.setName(element.children)
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
