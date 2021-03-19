<!-- 基本弹框样式封装 -->
<template>
  <div class="detailDialog">
    <el-dialog :top="top" :title="dialogVal.title" :visible.sync="dialogVal.dialogVisible" :width="width" :before-close="handleClose">
      <div>
        <slot name="dialogbody"></slot>
      </div>
      <span slot="footer" v-if="footerShow" class="dialog-footer">
        <el-button :size="size" @click="handleClose">{{ cancelText }}</el-button>
        <el-button :type="buttonType" :size="size" @click="handleSure">{{ sureText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogType } from '@/types/dialog-type'
@Component({})
export default class DetailDialog extends Vue {
  @Prop({
    default: {
      dialogVisible: false,
      title: '提示'
    }
  })
  dialogVal!: DialogType
  @Prop({ type: String, default: '990px' }) width!: string
  @Prop({ type: String, default: 'mini' }) size!: string
  @Prop({ type: String, default: 'primary' }) buttonType!: string
  @Prop({ type: String, default: '取 消' }) cancelText!: string
  @Prop({ type: String, default: '确 定' }) sureText!: string
  @Prop({ type: Boolean, default: true }) footerShow!: boolean
  @Prop({ type: String, default: '0' }) top!: string
  private handleClose() {
    this.$emit('handleClose')
  }
  private handleSure() {
    this.$emit('handleSure')
  }
}
</script>

<style lang="scss">
.detailDialog {
  .el-dialog__wrapper {
    margin: 40px 0px;
  }
  .el-dialog {
    margin: 0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    height: 100%;
  }
  .el-dialog__header {
    border-radius: 5px;
    padding: 10px 20px;
    // border-bottom: 1px solid #e4e6e9;
    box-shadow: 0 1px 1px 0 #eee;
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 20px;
    height: calc(100% - 93px);
    max-height: calc(100% - 93px);
    overflow: auto;
  }
  .el-dialog__footer {
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-top: 1px solid #e4e6e9;
  }
}
</style>
