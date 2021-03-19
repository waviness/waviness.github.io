<template>
  <div class="layoutHeader clearfix">
    <div class="headerWarp left">
      <h1 class="logo">
        <img src="../../../assets/images/layoutlogo.png" alt="" />
      </h1>
    </div>
    <div v-if="moduleName === 'admin'" class="adminHeader left">
      <i class="iconfont ytcrm-houtaiguanlixitong"></i>
      后台管理系统
    </div>
    <div v-if="moduleName === 'admin'" class="adminBack right" @click="clickCommand('backCrm')">
      <ul class="clearfix">
        <li class="backCrm left">返回首页</li>
        <li class="loginOut left">退出系统</li>
      </ul>
    </div>
    <div v-if="moduleName === 'crm'" class="menuTab left">
      <el-menu router :default-active="userHeaderActiveIndex" class="el-menu-demo" text-color="#5c6075" active-text-color="#2362fb" mode="horizontal" @select="headerMenuSelect">
        <el-menu-item v-for="(item, index) in menuList" :index="item.path" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.pmsName }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div v-if="moduleName === 'crm'" class="information right">
      <ul class="clearfix">
        <li class="message left">
          <el-badge :value="10" class="item">
            <i class="el-icon-message"></i>
          </el-badge>
        </li>
        <li class="infor left">
          <el-dropdown trigger="click" @command="clickCommand">
            <span class="el-dropdown-link">
              <span class="name">
                <img :src="headerImg" class="name__img">
              </span>
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="layoutHeader-dropDown" slot="dropdown">
              <el-dropdown-item command="modifyHeaderImg">
                <i class="el-icon-user"></i>
                修改头像
              </el-dropdown-item>
              <el-dropdown-item command="modifyPassword">
                <i class="el-icon-setting"></i>
                修改密码
              </el-dropdown-item>
              <el-dropdown-item command="backLogin">
                <i class="iconfont ytcrm-tuichu"></i>
                退出登录
              </el-dropdown-item>
              <el-dropdown-item class="enterAdminWarp" command="admin" divided>
                <li class="enterAdmin">企业管理后台</li>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>

    <a-modal title="修改密码" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧密码">
            <a-input type="password" placeholder="请输入旧密码" v-decorator="['oldpassword', validatorRules.oldpassword]" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码">
            <a-input type="password" placeholder="请输入新密码" v-decorator="['password', validatorRules.password]" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="确认新密码">
            <a-input type="password" @blur="handleConfirmBlur" placeholder="请确认新密码" v-decorator="['confirmpassword', validatorRules.confirmpassword]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal title="修改头像" :width="600" :visible="headerVisible" :confirmLoading="confirmLoading" @ok="handleImgOk" @cancel="handleCancel" cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <a-row>
          <a-col :xs="24" :md="12" :style="{height: '300px'}">
            <a-upload-dragger
              name="file"
              :multiple="false"
              :file-list="fileList"
              :showUploadList="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" :style="{ color: '#666' }" />
              </p>
              <p class="ant-upload-text">
                点击或拖拽文件到这里上传
              </p>
              <p class="ant-upload-hint">
                只支持上传图片文件，大小不超过4M
              </p>
            </a-upload-dragger>
          </a-col>
          <a-col :xs="24" :md="12" :style="{height: '300px'}">
            <div class="avatar-div">
              预览
              <img :src="headerImg" class="avatar-div__img" title="点击预览" @click="() => {this.previewVisible = true}" />
            </div>
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="() => {this.previewVisible = false}">
      <img alt="example" style="width: 100%" :src="headerImg" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class' // namespaced为true时候 Mutation使用方式
import { getLayoutColor } from '@/utils/getLayoutColor'
import { logout, updatePwd, updateHeadImgUrl } from '@/api/login'
const userModule = namespace('user')
@Component({})
export default class LayoutHeader extends Vue {
  @userModule.Mutation SET_HEADERACTIVEINDEX: any
  @Getter userHeaderActiveIndex?: string
  @Prop() private menuList: any
  @Prop() private moduleName!: string
  private headerVisible: boolean = false
  private previewVisible: boolean = false
  private fileList: any = []
  private headerImg: string = ''
  private visible: boolean = false
  private confirmLoading: boolean = false
  private validatorRules: any = {
    oldpassword: {
      rules: [
        {
          required: true,
          message: '请输入旧密码!'
        }
      ]
    },
    password: {
      rules: [
        {
          required: true,
          message: '请输入新密码!'
        }
      ]
    },
    confirmpassword: {
      rules: [
        {
          required: true,
          message: '请确认新密码!'
        }
      ]
    }
  }
  private confirmDirty: boolean = false
  private labelCol: any = {
    xs: { span: 24 },
    sm: { span: 5 }
  }
  private wrapperCol: any = {
    xs: { span: 24 },
    sm: { span: 16 }
  }
  private form: any
  created() {
    const root: any = this.$root
    this.headerImg = localStorage.getItem('headImgUrl') ? root.domainUrl + localStorage.getItem('headImgUrl') : ''
    this.form = this.$form.createForm(this)
    this.validatorRules = {
      oldpassword: {
        rules: [
          {
            required: true,
            message: '请输入旧密码!'
          }
        ]
      },
      password: {
        rules: [
          {
            required: true,
            message: '请输入新密码!'
          },
          {
            validator: this.validateToNextPassword
          }
        ]
      },
      confirmpassword: {
        rules: [
          {
            required: true,
            message: '请确认新密码!'
          },
          {
            validator: this.compareToFirstPassword
          }
        ]
      }
    }
  }
  private headerMenuSelect(key: string) {
    this.SET_HEADERACTIVEINDEX(key)
  }
  private clickCommand(command: string) {
    console.log(command)
    switch (command) {
      case 'backLogin':
        this.$confirm('即将退出系统登陆，是否继续？').then(async () => {
          const res: any = await logout()
          if (res.success) {
            localStorage.clear()
            this.$router.replace({ name: 'login' })
            location.reload()
          } else {
            this.$message.error(res.msg || '退出失败')
          }
        })
        break
      case 'admin':
        this.$router.push({
          name: 'admin'
        })
        getLayoutColor('admin')
        break
      case 'backCrm':
        this.$router.push({
          name: 'crm'
        })
        getLayoutColor('crm')
        break
      case 'modifyPassword':
        this.visible = true
        break
      case 'modifyHeaderImg':
        this.headerVisible = true
        break
      default:
        break
    }
  }
  private handleCancel() {
    this.visible = false
    this.headerVisible = false
  }
  private validateToNextPassword(rule: any, value: any, callback: any) {
    if (value && this.confirmDirty) {
      this.form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  private compareToFirstPassword(rule: any, value: any, callback: any) {
    if (value && value !== this.form.getFieldValue('password')) {
      callback(new Error('两次输入的密码不一样！'))
    } else {
      callback()
    }
  }
  private handleConfirmBlur(e: any) {
    const value = e.target.value
    this.confirmDirty = this.confirmDirty || !!value
  }
  private handleOk () {
    // 触发表单验证
    this.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.confirmLoading = true
        const formData = new FormData()
        formData.append('oldPwd', values.oldpassword)
        formData.append('newPwd', values.password)
        const res: any = await updatePwd(formData)
        this.confirmLoading = false
        if (res.success) {
          this.$message.success(res.msg || '修改成功')
          this.visible = false
        } else {
          this.$message.warning(res.msg || '修改失败')
        }
      }
    })
  }
  private beforeUpload(file: any) {
    const isLimit = file.size / 1024 / 1024 <= 4
    if (!isLimit) {
      this.$message.warning(`${file.name}文件大小超出限制，请修改后重新上传`)
      return false
    }
    this.fileList = [file]
    return false
  }
  private getBase64(img: any, callback: any) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  private handleChange(info: any) {
    this.getBase64(info.file, (imageUrl: string) => {
      this.headerImg = imageUrl
    })
  }
  private async handleImgOk () {
    if (!this.fileList) {
      this.$message.warning('请选择文件!')
      return
    }
    this.confirmLoading = true
    const formData = new FormData()
    formData.append('headImg', this.fileList[0])
    const res: any = await updateHeadImgUrl(formData)
    this.confirmLoading = false
    if (res.success) {
      this.$message.success(res.msg || '修改成功')
      localStorage.setItem('headImgUrl', this.headerImg)
      this.visible = false
    } else {
      this.$message.warning(res.msg || '修改失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.layoutHeader {
  .headerWarp {
    width: 200px;
    .logo {
      padding-top: 10px;
      img {
        height: 40px;
      }
    }
  }
  .menuTab {
    .el-menu.el-menu--horizontal {
      border-bottom: none;
    }
    .el-menu-item {
      padding: 0px;
      margin: 0px 20px;
      i {
        font-size: 17px;
        color: #5c6075;
      }
      span {
        margin-left: 2px;
        font-size: 16px;
      }
      &.is-active {
        border-bottom: 3px solid #2362fb;
        i {
          color: #2362fb;
        }
      }
    }
  }
  .information {
    cursor: pointer;
    .message {
      margin-top: 18px;
      line-height: 30px;
      i {
        padding-left: 10px;
        font-size: 24px;
        color: rgb(252, 146, 63);
      }
      .number {
        padding-left: 3px;
      }
    }
    .infor {
      margin: 0px 0px 0px 30px;
      &:hover {
        color: #2362fb;
      }
      .name {
        font-size: 12px;
        color: white;
        // background: #2362fb;
        display: inline-block;
        margin-top: 8px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        &__img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .adminHeader {
    line-height: 60px;
    color: #333;
    letter-spacing: 1px;
    font-size: 18px;
    font-weight: 700;
    i {
      color: rgb(252, 146, 63);
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .adminBack {
    .backCrm {
      width: 80px;
      height: 30px;
      cursor: pointer;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      border-radius: 5px;
      margin: 15px 20px 0px 0px;
      background: rgb(252, 146, 63);
      color: white;
    }
    .loginOut {
      width: 80px;
      height: 30px;
      cursor: pointer;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      border-radius: 5px;
      margin: 15px 0px 0px;
      background: rgba(215, 215, 215, 1);
      color: white;
    }
  }
}
.avatar-div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  &__img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>
