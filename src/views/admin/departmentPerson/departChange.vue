<!-- 部门选择 部门+主部门  -->
<template>
  <div class="departChangeWarp">
    <common-dialog :dialogVal="departChangedialogVal" :width="'50%'" @handleClose="departChangeHandleClose" @handleSure="departChangeHandleSure">
      <div slot="dialogbody" class="departChange dialogStyleChange">
        <div class="warp clearfix">
          <div class="mainLeft left">
            <div class="input">
              <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText"></el-input>
            </div>
            <div class="tree scrollbar" v-loading="treeloading">
              <el-tree
                class="filter-tree"
                :data="depTreeList"
                :props="treeProps"
                node-key="depId"
                default-expand-all
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                :highlight-current="true"
                :check-strictly="true"
                @node-click="depListClick"
                ref="tree"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span>{{ node.label }}</span>
                  <i v-if="node.checked" style="color: #ccc;margin-left:5px;" class="el-icon-check"></i>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="mainRight right">
            <ul>
              <li class="header">已选择的部门</li>
              <li class="departName" v-for="(item, index) in depList" :key="index">
                {{ item.depName }}
                <span class="chooseMain" v-if="!item.isMain" @click="chooseMainClick(item, index)">设置为主部门</span>
                <span class="right" v-if="item.isMain">主</span>
                <i class="el-icon-close" @click="deleteChooseDepart(item, index)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </common-dialog>
  </div>
</template>

<script lang="ts">
import { getDepTree } from '@/api/common'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import commonDialog from '@/components/commonDialog/index.vue'
import { compareArr } from '@/utils/common'
@Component({
  components: {
    commonDialog
  }
})
export default class DepartChange extends Vue {
  @Prop() private departChangedialogVal!: boolean
  @Prop() private departChooseList!: any
  @Prop({ default: false }) private addPersonVisible!: boolean
  private depList: any = []
  private hasMain: boolean = false
  // 组织架构树结构 props
  private treeProps: any = {
    value: 'depId',
    label: 'depName',
    children: 'childList'
  }
  private depTreeList: any = []
  private treeloading: boolean = false
  // 获取部门树结构信息
  private _getDepTree(
    params: any = {
      treeType: 1
    }
  ) {
    this.treeloading = true
    getDepTree(params).then(res => {
      if (res.code === '200') {
        this.treeloading = false
        this.depTreeList = res.data
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  // 可搜索部门
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.depName.indexOf(value) !== -1
  }
  private depListClick(data: any) {
    console.log(data)
    for (let i = 0; i < this.depList.length; i++) {
      const item = this.depList[i]
      if (item.depId === data.depId) {
        if (item.isMain) {
          if (this.depList[i + 1]) {
            this.$set(this.depList[i + 1], 'isMain', true)
          }
        }
        this.depList.splice(i, 1)
        return
      }
    }
    if (this.depList.length === 0) {
      if (this.addPersonVisible) {
        this.depList.push({
          depName: data.depName,
          depId: data.depId,
          isMain: false
        })
      } else {
        this.depList.push({
          depName: data.depName,
          depId: data.depId,
          isMain: true
        })
      }
    } else {
      this.depList.push({
        depName: data.depName,
        depId: data.depId,
        isMain: false
      })
    }
  }
  private filterText: string = ''
  // 确定
  private departChangeHandleSure() {
    console.log(this.depList)
    let deleteList
    if (this.departChooseList && this.departChooseList.length > 0) {
      deleteList = compareArr(this.departChooseList, this.depList, true, 'depId')
    } else {
      deleteList = []
    }
    console.log(this.depList)
    console.log(this.departChooseList)
    const val = {
      depList: this.depList,
      deleteList: deleteList
    }
    this.$emit('departChangeHandleSure', val)
  }
  // 关闭弹框
  private departChangeHandleClose() {
    console.log(this.depList)
    console.log(this.departChooseList)
    this.$emit('departChangeHandleClose')
  }
  // 设置主部门点击
  private chooseMainClick(item: any, index: any) {
    for (let i = 0; i < this.depList.length; i++) {
      if (this.depList[i].isMain) {
        this.$set(this.depList[i], 'isMain', false)
      }
    }
    this.$set(item, 'isMain', true)
    this.$set(this.depList, index, item)
  }
  // 点击删除已经选择部门
  private deleteChooseDepart(item: any, index: number) {
    const chooseId: any = []
    if (item.isMain) {
      // 删除部门为主部门的时候要设置第一个部门为主部门
      this.depList.forEach((element: any, i: any) => {
        if (element.depId === item.depId) {
          this.depList.splice(i, 1)
        }
        if (!this.depList[0]) return
        this.$set(this.depList[0], 'isMain', true)
      })
    } else {
      this.depList.splice(index, 1)
    }
    // 同时获取实时部门id 设置树结构状态
    this.depList.forEach((element: any) => {
      chooseId.push(element.depId)
    })
    console.log(chooseId)
    this.changeTreeStatus(chooseId, true)
  }
  // 设置树结构选中状态
  private changeTreeStatus(changeObj: any, status: boolean) {
    const obj: any = this.$refs.tree
    obj.setCheckedKeys(changeObj, status)
  }
  private init() {
    this.depList = []
    if (this.departChooseList.length > 0) {
      this.depList = JSON.parse(JSON.stringify(this.departChooseList))
    }
    // 判断当前部门信息中是否有主部门
    this.hasMain = this.depList.some((item: any) => {
      return item.isMain
    })
    // 根据父组件传递部门信息 获取树结构需选中id
    const treeChoose: any = []
    this.depList.forEach((element: any) => {
      treeChoose.push(element.depId)
    })
    this.$nextTick(() => {
      this.changeTreeStatus(treeChoose, true)
    })
  }
  mounted() {
    this._getDepTree()
    this.init()
  }
  @Watch('filterText')
  onFilterTextChanged(val: any) {
    const obj: any = this.$refs.tree
    obj.filter(val)
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.departChange {
  .warp {
    height: 520px;
  }
  .mainLeft {
    width: 50%;
    height: 100%;
    .tree {
      padding-top: 10px;
      height: calc(100% - 42px);
      overflow: auto;
    }
  }
  .mainRight {
    width: 45%;
    height: 100%;
    padding-left: 20px;
    border-left: 1px solid #e4e6e9;
    .header {
      color: #787878;
      margin-bottom: 10px;
    }
    .departName {
      color: #000;
      line-height: 28px;
      height: 28px;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 30px;
      position: relative;
      span {
        color: #9b9b9b;
      }
      .el-icon-close {
        width: 20px;
        position: absolute;
        text-align: center;
        right: 5px;
        top: 0px;
        line-height: 28px;
        color: #777;
        cursor: pointer;
        font-weight: 700;
        z-index: 10;
        &:hover {
          background-color: #eee;
        }
      }
      .chooseMain {
        margin-left: 10px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
      }
      &:hover .chooseMain {
        opacity: 1;
      }
    }
  }
}
</style>
