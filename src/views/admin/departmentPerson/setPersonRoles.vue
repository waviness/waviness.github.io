<template>
  <div class="setPersonRole">
    <common-dialog :dialogVal="setPersonRolesdialogVal" :width="'50%'" @handleClose="setPersonRolesClose" @handleSure="setPersonRolesSure">
      <div class="setRole" slot="dialogbody">
        <div class="warp left">
          <div class="select">
            <el-select size="small" @change="selectChange" v-model="dictionaries" filterable placeholder="请选择">
              <el-option v-for="item in getDictionariesList" :key="item.DIC_SELECT_ID" :label="item.DIC_SELECT_NAME" :value="item.DIC_SELECT_ID">
                <span style="float: left">{{ item.DIC_SELECT_ID }}/{{ item.DIC_SELECT_NAME }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="content">
            <ul>
              <li @click="changeRole(item)" v-for="(item, index) in roleList" :class="item.checked ? 'active' : ''" :key="index">
                {{ item.roleId }}/{{ item.roleName }}
                <i v-if="item.checked" style="color: #ccc;margin-left:5px;" class="el-icon-check"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="warp right" style="border-left: 1px solid #eee;height:520px">
          <ul class="content">
            <li v-for="(item, index) in checkList" :key="index">
              {{ item.roleId }}/{{ item.roleName }}
              <i class="el-icon-close" @click="deleteRole(item)"></i>
            </li>
          </ul>
        </div>
      </div>
    </common-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import commonDialog from '@/components/commonDialog/index.vue'
import { getDictionaries } from '@/api/admin/dictionary'
import { getRoles } from '@/api/admin'
@Component({
  components: {
    commonDialog
  }
})
export default class SetRole extends Vue {
  @Prop() setPersonRolesdialogVal: any
  @Prop({ default: [] }) getCheckList: any
  private getDictionariesList: any = []
  private dictionaries: any = 1
  private roleList: any = []
  private checkList: any = []
  private pageSize: number = 200
  private page: number = 1
  private setPersonRolesClose() {
    this.$emit('setPersonRolesClose')
  }
  private setPersonRolesSure() {
    this.$emit('setPersonRolesSure', this.checkList)
  }
  private _getDictionaries() {
    const params = {
      typeId: 6,
      keyword: '',
      pageSize: this.pageSize,
      pageNum: this.page
    }
    getDictionaries(params).then(res => {
      if (res.code === '200') {
        this.getDictionariesList = res.data.list
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  private _getRoles(roleType: number) {
    const params = {
      roleType: roleType
    }
    getRoles(params).then(res => {
      if (res.code === '200') {
        this.roleList = res.data
      }
    })
  }
  private changeRole(val: any) {
    this.checkList = []
    if (val.checked) {
      this.$set(val, 'checked', false)
    } else {
      this.$set(val, 'checked', true)
    }
    for (let index = 0; index < this.roleList.length; index++) {
      const element = this.roleList[index]
      if (element.checked) {
        this.checkList.push(element)
      }
    }
  }
  private selectChange(val: number) {
    this._getRoles(val)
  }
  private deleteRole(val: any) {
    for (let index = 0; index < this.checkList.length; index++) {
      const element = this.checkList[index]
      if (element.roleId === val.roleId) {
        this.checkList.splice(index, 1)
      }
    }
    for (let index = 0; index < this.roleList.length; index++) {
      const element = this.roleList[index]
      if (element.roleId === val.roleId) {
        this.$set(this.roleList[index], 'checked', false)
      }
    }
  }
  mounted() {
    this.checkList = JSON.parse(JSON.stringify(this.getCheckList))
    this._getDictionaries()
    this._getRoles(1)
  }
  @Watch('roleList')
  onchangeroleListChanged(n: any) {
    if (n.length > 0) {
      for (let index = 0; index < n.length; index++) {
        const ele = n[index]
        for (let checkIndex = 0; checkIndex < this.checkList.length; checkIndex++) {
          const element = this.checkList[checkIndex]
          if (element.roleId === ele.roleId) {
            this.$set(ele, 'checked', true)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setPersonRole {
  width: 100%;
  .setRole {
    height: 520px;
    overflow: auto;
    .warp {
      width: 49%;
    }
    .select,
    .el-select {
      width: 100%;
    }
    .content {
      padding: 0px 10px;
      line-height: 40px;
      ul {
        padding-top: 5px;
        width: 100%;
      }
      li {
        padding-left: 20px;
        margin: 5px 0px;
        width: 100%;
        cursor: pointer;
        &:hover {
          background: #f1f1fe;
        }
        &.active {
          background: #f2f6fc;
          color: #fc923f;
        }
      }
    }
  }
}
</style>
