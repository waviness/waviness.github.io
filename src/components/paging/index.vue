<!-- 分页样式 -->
<template>
  <div class="paging">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[firstPageSize, firstPageSize + 10, firstPageSize + 20, firstPageSize + 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class Paging extends Vue {
  @Prop() private page!: number
  @Prop() private total!: number
  @Prop() private pageSize!: number
  private firstPageSize: number = 0
  private handleCurrentChange(val: number) {
    this.$emit('changeCurrentPage', val)
  }
  private handleSizeChange(val: number) {
    this.$emit('handleSizeChange', val)
  }
  mounted() {
    this.firstPageSize = this.pageSize
  }
}
</script>

<style lang="scss">
.paging {
  width: calc(100% - 1px);
  position: absolute;
  bottom: 0px;
  left: 1px;
  .el-pagination {
    float: right;
    padding: 10px 20px;
  }
  .el-pagination .btn-next,
  .el-pagination .btn-prev {
    background: inherit;
  }
  .el-dialog,
  .el-pager li {
    background: inherit;
  }
}
</style>
