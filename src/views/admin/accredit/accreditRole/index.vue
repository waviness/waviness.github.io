<!-- 角色权限管理 -->
<template>
  <div class="admin accredit-role">
    <header>
      <container-header :title="title" :seachNeed="false" :activeTextColor="activeTextColor"></container-header>
    </header>
    <div class="accredit-role-main">
      <div class="accredit-role-main__left" v-loading="roleLoading">
        <div class="accredit-role-main__header">
          <div class="accredit-role-main__header--content">
            <a-select
              placeholder="选择角色类型"
              style="width: 200px"
              v-model="roleType"
              @change="handleChange"
            >
              <a-select-option v-for="(item, index) in roleTypeList" :key="index" :value="item.DIC_SELECT_ID">
                {{item.DIC_SELECT_NAME}}
              </a-select-option>
            </a-select>
          </div>
          <div class="accredit-role-main__header--btn">
            <a-button type="link" @click="handleEdit(1)">创建角色</a-button>
          </div>
        </div>
        <div v-if="dataSource.length" class="role-list">
          <div :class="[item.roleId === roleModel.roleId ? 'role-item--active' : '', 'role-item']" v-for="(item, index) in dataSource" :key="index" @click="handlePerssion(item)">
            <div class="role-item__title">{{item.roleName}}</div>
            <div class="role-item__btns">
              <a-icon type="edit" :style="{ color: '#fa8c16' }" title="编辑" @click.stop="handleEdit(2, item)" />
              <a-popconfirm class="admin" :title="popTitle" :cancelText="popCancelText" @confirm="() => handleDelete(item.roleId)">
                <a-icon type="delete" :style="{ color: '#ff4d4f' }" title="删除" @click.stop />
              </a-popconfirm>
            </div>
          </div>
        </div>
        <a-empty v-else description="该类型下无角色" class="mt-100" />
      </div>
      <div class="accredit-role-main__right" v-loading="loading">
        <div class="accredit-role-main__header">
          <div class="accredit-role-main__header--content">
            模块功能
          </div>
        </div>
        <div class="accredit-role-main__center">
          <a-tabs v-model="type" @change="loadData">
            <a-tab-pane v-for="item in plantformTypeList" :key="item.DIC_SELECT_ID" :tab="item.DIC_SELECT_NAME" />
          </a-tabs>
          <a-tree
            v-if="treeData.length"
            ref="tree"
            checkable
            @check="onCheck"
            :checkedKeys="checkedKeys"
            :treeData="treeData"
            @expand="onExpand"
            :expandedKeys="expandedKeysss"
            :checkStrictly="checkStrictly">
          </a-tree>
          <a-empty v-else description="暂无数据" class="mt-100" />
        </div>
        <div class="accredit-role-main__footer">
          <a-dropdown class="accredit-role-main__footer--opts" :trigger="['click']" placement="topCenter">
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
          <div class="accredit-role-main__footer--btn">
            <a-button @click="saveAuth" type="primary">保存</a-button>
          </div>
        </div>
      </div>
    </div>
    <role-modal ref="modalForm" @ok="getRoleList"></role-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import containerHeader from '@/components/containerHeader/index.vue'
import RoleModal from './modules/RoleModal.vue'
import AuthModal from './modules/AuthModal.vue'
import { getRoles, deleteRoleById, queryMenuList, updateRole, getRoleInfo } from '@/api/admin'
import { getDictionaries } from '@/api/admin/dictionary'

@Component({
  components: {
    containerHeader,
    RoleModal,
    AuthModal
  }
})
export default class AccreditMenu extends Vue {
  private title: any = {
    iconfont: 'iconfont ytcrm-jiaose1',
    content: '角色管理'
  }
  private activeTextColor: string = '#fc923f'
  private popTitle: string = '确定删除吗?'
  private popCancelText: string = '取消'
  private plantformTypeList: any = []
  private type: string = '' // 平台类型
  private roleType: string = ''
  private roleTypeList: any = []
  private roleLoading: boolean = false
  private loading: boolean = false
  private dataSource: any = []
  private roleModel: any = {}
  private treeData: any = []
  private allTreeKeys: any = []
  private expandedKeysss: any = []
  private checkedKeys: any = []
  private defaultCheckedKeys: any = []
  private checkStrictly: boolean = false
  private checkedKeysResult: any = []
  private roleTree: any = []
  private roleTreeLeaf: any = []
  created() {
    this.getRoleTypes()
  }
  private async getRoleTypes() {
    const res = await getDictionaries({
      pageNum: 1,
      pageSize: 20,
      typeId: 6
    })
    this.roleTypeList = res.data.list
    this.roleType = this.roleTypeList[0].DIC_SELECT_ID
    this.getRoleList()
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
  private handleChange() {
    this.getRoleList()
  }
  // 角色 1新增 2编辑
  private handleEdit(type: number, record?: any) {
    const modal: any = this.$refs.modalForm
    modal.title = type === 2 ? '编辑' : '新增'
    modal.roleType = +this.roleType
    modal.edit(record)
  }
  // 删除角色
  private async handleDelete(roleId: string) {
    const res: any = await deleteRoleById({ roleId })
    if (res.success) {
      this.getRoleList()
      this.$message.success('删除成功')
    } else {
      this.$message.warning(res.msg || '删除失败')
    }
  }
  // 按角色类型获取角色列表
  private async getRoleList() {
    this.dataSource = []
    this.roleLoading = true
    const res: any = await getRoles({ roleType: this.roleType })
    this.roleLoading = false
    this.dataSource = res.data
    await this.getPlatformTypes()
    await this.handlePerssion(this.dataSource[0])
  }
  // 获取角色菜单授权
  private async handlePerssion(record: any) {
    this.reset()
    this.roleModel = record
    await this.loadData()
    if (record && record.roleId) {
      await this.getRoleInfoById()
    }
  }
  // 获取权限树
  private async loadData() {
    this.treeData = []
    this.loading = true
    const res: any = await queryMenuList({ plantformType: this.type })
    this.loading = false
    this.treeData = res.data || []
    this.allTreeKeys = []
    this.setName(this.treeData)
    setTimeout(() => {
      const treeRef: any = this.$refs.tree
      this.setTreeStyle(treeRef)
    }, 500)
  }
  // 按钮层数据平铺展示
  private setTreeStyle(treeNodes: any) {
    if (treeNodes && treeNodes.length) {
      treeNodes.forEach((element: any) => {
        if (element.title) {
          if (element.label) { // 树数据获取的时候做了处理  该节点类型为菜单的时候label为true
            if (element.$el.querySelector('ul')) { // 菜单节点下面有ul说明有按钮 再次添加样式
              element.$el.querySelector('ul').style = 'display: flex'
              element.$el.querySelector('ul').querySelectorAll('li').forEach((node: any) => {
                node.style = 'padding: 8px 0 0 0'
              })
            }
          }
          if (element.$children.length) {
            this.setTreeStyle(element.$children)
          }
        }
      })
    }
  }
  // 按树结构处理数据
  private setName(treeData: any) {
    treeData.forEach((element: any) => {
      this.allTreeKeys.push(element.pmsId)
      element.key = element.pmsId
      element.title = element.pmsName
      element.label = element.pmsType === 3
      if (element.children) {
        this.setName(element.children)
      }
    })
  }
  // 获取角色对应权限
  private async getRoleInfoById() {
    const res: any = await getRoleInfo({ roleId: this.roleModel.roleId })
    this.roleTree = []
    this.roleTreeLeaf = []
    this.getTreeIds(res.data.pmsTree)
    this.getTreeLeafIds(res.data.pmsTree)
    this.checkedKeysResult = [...this.roleTree]
    this.checkedKeys = [...this.roleTreeLeaf]
    this.defaultCheckedKeys = [...this.roleTreeLeaf]
    this.expandedKeysss = this.allTreeKeys
  }
  // 获取所有树节点id
  private getTreeIds(treeData: any) {
    treeData.forEach((element: any) => {
      this.roleTree.push(element.pmsId)
      if (element.children) {
        this.getTreeIds(element.children)
      }
    })
  }
  // 获取所有树叶子节点id
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
    this.treeData = []
    this.expandedKeysss = []
    this.checkedKeys = []
    this.checkedKeysResult = []
    this.defaultCheckedKeys = []
    this.loading = false
  }
  // 全选
  private checkALL () {
    this.checkedKeys = this.allTreeKeys
    this.checkedKeysResult = this.allTreeKeys
  }
  // 取消全选
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
  // 保存权限树
  private async saveAuth() {
    if (!this.roleModel || !this.roleModel.roleId) {
      this.$message.warning('请先选择一个角色')
      return
    }
    console.log('save')
    const params = {
      roleId: this.roleModel.roleId,
      roleName: this.roleModel.roleName,
      roleKeyword: this.roleModel.roleKeyword,
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
  }
}
</script>

<style lang="scss" scoped>
.accredit-role {
  padding: 10px;
  height: 100%;
  &-main {
    display: flex;
    height: calc(100% - 50px);
    &__left {
      width: 26%;
      // border-right: 1px solid #eee;
      margin-right: 8px;
      background: #fff;
    }
    &__right {
      background: #fff;
      flex: auto;
      display: flex;
      flex-direction: column;
    }
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    &__center {
      flex: 1;
      padding: 0 20px;
      overflow: auto;
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      height: 50px;
      padding: 8px;
      border-top: 1px solid #eee;
    }
  }
}
.role-list {
  padding: 5px 0;
}
.role-item {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 6px 12px;
  &:hover {
    background: #fafafa;
    .role-item__btns {
      display: block;
    }
  }
  &--active {
    background: #fff7e6;
  }
  &__btns {
    display: none;
    i {
      margin-left: 8px;
    }
  }
}
.mt-100 {
  margin-top: 100px;
}
.table-operator {
  margin: 15px 0;
  .ant-btn {
    margin-right: 10px;
  }
}
</style>
