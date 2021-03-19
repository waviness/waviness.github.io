<!-- 人员职务字典维护 -->
<template>
  <div class="roledataDic">
    <common-dic :typeDic="typeDic" :title="title" :columns="columns"></common-dic>
  </div>
</template>

<script lang="ts">
import commonDic from '@/views/admin/dataDictionary/commonDic.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    commonDic
  }
})
export default class PersonPositionDic extends Vue {
  // container-header所需参数
  private typeDic: number = 7
  private title: any = {
    iconfont: 'iconfont ytcrm-zhiye',
    content: '人员职务字典维护'
  }
  private columns: any = [
    {
      prop: 'DIC_SELECT_ID',
      label: '职务ID',
      align: 'left',
      width: '120px',
      editingType: 'input',
      formatter: (row: any) => {
        return `<span>${row.DIC_SELECT_ID}</span>`
      }
    },
    {
      prop: 'DIC_SELECT_NAME',
      label: '职务名称',
      align: 'left',
      minWidth: '250px',
      editingType: 'input',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${row.DIC_SELECT_NAME}</span>`
      }
    },
    {
      prop: 'USESTATUS',
      label: '状态',
      align: 'left',
      minWidth: '100px',
      editingType: 'select',
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
      // , column: any, cellValue: any
      formatter: (row: any) => {
        return `<span>${+row.USESTATUS === 1 ? '<span style="color: green">正式</span>' : '<span class="fontWeight">作废</span>'}</span>`
      }
    },
    {
      prop: 'UPDATE_ID',
      label: '操作人员信息',
      align: 'left',
      minWidth: '200px',
      // , column: any, cellValue: any
      formatter: (row: any) => {
        if (row.UPDATE_ID) {
          return `<span>${row.UPDATE_ID}/${row.UPDATE_NAME}</span>`
        }
      }
    },
    {
      prop: 'UPDATE_TIME',
      label: '操作时间',
      align: 'left',
      minWidth: '160px'
    }
  ]
}
</script>

<style lang="scss" scoped>
.roledataDic {
  width: 100%;
  height: 100%;
}
</style>
