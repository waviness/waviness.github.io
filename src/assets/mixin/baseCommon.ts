import { Component, Vue } from 'vue-property-decorator'
import containerHeader from '@/components/containerHeader/index.vue'
import paging from '@/components/paging/index.vue'
import menuBar from '@/components/menubar/index.vue'
import baseTable from '@/components/baseTable/index.vue'
import btnTab from '@/components/btnTab/index.vue'
import commonDialog from '@/components/commonDialog/index.vue'
import DetailDialog from '@/components/detailDialog/index.vue'
import noData from '@/components/nodata/index.vue'
@Component({
  components: {
    containerHeader,
    paging,
    menuBar,
    baseTable,
    btnTab,
    commonDialog,
    DetailDialog,
    noData
  }
})
export default class BaseCommon extends Vue {
  // 页码 每页数量 以及总数
  protected page: number = 1
  protected pageSize: number = 20
  protected total: number = 0
  protected tableHeight: number = -1
  // 表格样式基本相同 可根据需要覆盖 覆盖的时候定义参数不能设为私有 可都设置为protected
  protected options: any = {
    border: true,
    size: 'mini',
    stripe: true, // 是否为斑马纹 table
    loading: false, // 是否添加表格loading加载动画
    highlightCurrentRow: true, // 是否支持当前行高亮显示
    mutiSelect: true // 是否支持列表项选中功能
  }
  mounted() {
    if (document.getElementsByClassName('mainTable').length > 0) {
      this.tableHeight = document.getElementsByClassName('mainTable')[0].clientHeight
    }
  }
}
