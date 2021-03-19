<!-- 菜单管理 -->
<template>
  <div class="admin accredit-menu">
    <header>
      <container-header :title="title" :placeholder="placeholder" :activeTextColor="activeTextColor" :seachPlace="seachPlace" @seachValueBtn="seachValueBtn"></container-header>
    </header>
    <a-card :bordered="false">
      <a-tabs v-model="type" @change="onTabChange">
        <a-tab-pane v-for="item in plantformTypeList" :key="item.DIC_SELECT_ID" :tab="item.DIC_SELECT_NAME" />
      </a-tabs>

      <!-- <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="菜单">
                <a-input v-model="searchValue" placeholder="请输入关键词"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item>
                <a-button type="primary" @click="searchQuery">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div> -->

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleEdit(0)" type="primary" icon="plus">新增根菜单</a-button>
        <!-- <a-button @click="batchDel" v-if="selectedRowKeys.length > 0" ghost type="primary" icon="delete">批量删除</a-button> -->
      </div>

      <!-- table区域-begin -->
      <div>
        <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
          已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
          项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div> -->

        <!-- <a-table
          bordered
          rowKey="pmsId"
          :columns="columns"
          size="middle"
          :pagination="false"
          :dataSource="dataSource"
          :loading="loading"
          :expandedRowKeys="expandedRowKeys"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @expandedRowsChange="handleExpandedRowsChange"
        > -->
        <a-table
          bordered
          rowKey="pmsId"
          :columns="columns"
          size="middle"
          :pagination="false"
          :dataSource="dataSource"
          :locale="locale"
          :loading="loading"
          :expandedRowKeys="expandedRowKeys"
          @expandedRowsChange="handleExpandedRowsChange"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(2, record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleEdit(3, record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a v-show="record.pmsType === 2 || record.pmsType === 3" href="javascript:;" @click="handleEdit(1, record)">添加下级</a>
                </a-menu-item>
                <!-- <a-menu-item>
                  <a href="javascript:;" @click="handleDataRule(record)">数据规则</a>
                </a-menu-item> -->
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.pmsId)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->

      <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    </a-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import containerHeader from '@/components/containerHeader/index.vue'
import PermissionModal from './modules/PermissionModal.vue'
import { queryMenuList, deleteMenuById } from '@/api/admin'
import { getDictionaries } from '@/api/admin/dictionary'

const menuType = ['', '数据权限', '目录', '菜单', '按钮']

@Component({
  components: {
    containerHeader,
    PermissionModal
  }
})
export default class AccreditMenu extends Vue {
  private title: any = {
    iconfont: 'iconfont ytcrm-caidanguanli',
    content: '菜单管理'
  }
  private placeholder: string = '关键字'
  private activeTextColor: string = '#fc923f'
  private seachPlace: string = 'center'
  private plantformTypeList: any = []
  private type: string = ''
  private searchValue: string = ''
  private loading: boolean = false
  private dataSource: any = []
  private locale: any = {
    emptyText: '暂无数据'
  }
  // 展开的行，受控属性
  private expandedRowKeys: any = []
  private selectedRowKeys: any = []
  private selectionRows: any = []
  private columns: any = [
    {
      title: '菜单名称',
      align: 'left',
      dataIndex: 'pmsName',
      key: 'pmsName'
    },
    {
      title: '菜单英文名',
      align: 'center',
      dataIndex: 'keyword',
      key: 'keyword'
    },
    {
      title: '菜单类型',
      align: 'center',
      dataIndex: 'pmsType',
      key: 'pmsType',
      customRender: function(text: any) {
        return menuType[+text]
      }
    },
    {
      title: 'icon',
      align: 'center',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '路径',
      align: 'center',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'orderNum',
      key: 'orderNum'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {
        customRender: 'action'
      },
      align: 'center',
      width: 150
    }
  ]
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
    this.getMenuList()
  }
  private onTabChange() {
    this.searchValue = ''
    this.getMenuList()
  }
  private searchQuery() {
    const routerArr: any = []
    this.dataSource.forEach((item: any) => {
      if (item.pmsName.indexOf(this.searchValue) !== -1) {
        routerArr.push(item)
      } else if (item.children) {
        item.children.forEach((child: any) => {
          if (child.pmsName.indexOf(this.searchValue) !== -1) {
            routerArr.push(child)
          } else if (child.children) {
            child.children.forEach((grandChild: any) => {
              if (grandChild.pmsName.indexOf(this.searchValue) !== -1) {
                routerArr.push(grandChild)
              }
            })
          }
        })
      }
    })
    this.dataSource = routerArr
  }
  private seachValueBtn(val: string) {
    this.searchValue = val
    this.getMenuList()
  }
  private searchReset() {
    this.searchValue = ''
    this.getMenuList()
  }
  private onClearSelected() {
    this.selectedRowKeys = []
    this.selectionRows = []
  }
  private onSelectChange(selectedRowKeys: any, selectionRows: any) {
    this.selectedRowKeys = selectedRowKeys
    this.selectionRows = selectionRows
  }
  private handleExpandedRowsChange(expandedRows: any) {
    this.expandedRowKeys = expandedRows
  }
  // 打开菜单 0新增根目录 1添加下级菜单 2编辑 3详情
  private handleEdit(type: number, record?: any) {
    const modal: any = this.$refs.modalForm
    const titleArr = ['新增根目录', '添加下级菜单', '编辑', '详情']
    modal.title = titleArr[type]
    modal.pmsType = type === 0 ? 2 : type === 1 ? (+record.pmsType === 2 ? 3 : 4) : record.pmsType
    modal.plantformType = this.type
    modal.disableSubmit = type === 3
    modal.isCreate = type === 0 || type === 1
    if (type === 0) {
      modal.edit({
        parentId: 0
      })
    } else if (type === 1) {
      modal.edit({
        parentId: record.pmsId,
        parentName: record.pmsName
      })
    } else {
      modal.edit(record)
    }
  }
  // 打开数据规则编辑
  // private handleDataRule(record: any) {
  // console.log('数据规则编辑', record)
  // this.$refs.PermissionDataRuleList.edit(record)
  // }
  private batchDel() {
    if (this.selectedRowKeys.length <= 0) {
      this.$message.warning('请选择一条记录！')
      return null
    } else {
      let ids = ''
      for (let a = 0; a < this.selectedRowKeys.length; a++) {
        ids += this.selectedRowKeys[a] + ','
      }
      // this.$confirm({
      //   title: '确认删除',
      //   content: '是否删除选中数据?',
      //   onOk: () => {
      //     this.loading = true
      //     console.log(ids)
      //     const res: any = {}
      //     this.loading = false
      //     if (res.success) {
      //       this.$message.success(res.msg)
      //       this.getMenuList()
      //       this.onClearSelected()
      //     } else {
      //       this.$message.warning(res.msg || '删除失败')
      //     }
      //   }
      // })
      this.$confirm('确认删除', '是否删除选中数据?').then(() => {
        this.loading = true
        console.log(ids)
        const res: any = {}
        this.loading = false
        if (res.success) {
          this.$message.success(res.msg)
          this.getMenuList()
          this.onClearSelected()
        } else {
          this.$message.warning(res.msg || '删除失败')
        }
      })
    }
  }
  private async handleDelete(pmsId: string) {
    const res: any = await deleteMenuById({ pmsId })
    if (res.success) {
      this.getMenuList()
      this.$message.success('删除成功')
    } else {
      this.$message.warning(res.msg || '删除失败')
    }
  }
  // 新增/修改 成功时，重载列表
  private modalFormOk() {
    this.getMenuList()
  }
  private async getMenuList() {
    this.loading = true
    const res: any = await queryMenuList({ plantformType: this.type, pmsName: this.searchValue })
    this.loading = false
    this.dataSource = res.data || []
  }
}
</script>

<style lang="scss" scoped>
.accredit-menu {
  padding: 10px;
}
.table-operator {
  margin-bottom: 15px;
  .ant-btn {
    margin-right: 10px;
  }
}

/deep/ .ant-card-body {
  padding-top: 10px;
}

/deep/ .ant-table-thead {
  th {
    text-align: center!important;
  }
}
</style>
