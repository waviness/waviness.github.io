<template>
  <div class="login">
    <div class="left loginBgWarp">
      <div class="loginBg"></div>
    </div>
    <div class="loginMainWarp left">
      <div class="loginMain">
        <div class="logo clearfix">
          <img class="logoImg left" src="../../assets/images/logo.png" alt="" />
          <h1 class="left">
            浙江英特集团股份有限公司
          </h1>
        </div>
        <div class="loginContent">
          <div class="header">
            登陆
          </div>
          <el-form ref="loginForm" :model="loginRuleForm" :rules="loginRules" label-width="0px" class="demo-ruleForm">
            <el-form-item label="" prop="userCode">
              <el-input v-model="loginRuleForm.userCode" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input v-model="loginRuleForm.password" placeholder="密码" show-password></el-input>
            </el-form-item>
            <el-form-item class="buttonClick">
              <el-button type="primary" @click="loginClick('loginForm')">登陆</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LoginValidate, LoginRules } from '@/types/login-type'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component({})
export default class Login extends Vue {
  @userModule.Action actionLogin: any
  private loginRuleForm: LoginValidate = {
    userCode: '',
    password: '',
    Yzm: ''
  }
  private loginRules: LoginRules = {
    userCode: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
      // { min: 6, message: '密码长度不小于6位', trigger: ['blur', 'change'] }
    ],
    Yzm: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  }
  private loginClick(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        const params: LoginValidate = {
          userCode: this.loginRuleForm.userCode,
          password: this.loginRuleForm.password,
          verifyKey: this.loginRuleForm.Yzm,
          secretKey: localStorage.getItem('secretKeyParam'),
          ifGetVerify: false
        }
        // const formData = new FormData()
        // formData.append('type', '1')
        // formData.append('userCode', this.loginRuleForm.userCode)
        // formData.append('password', this.loginRuleForm.password)
        this.actionLogin(params)
        // store.dispatch('actionLogin', params)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  mounted() {
    // 根据localStorage判断用户是否登录
    const code = localStorage.getItem('loginCode')
    console.log(Number(code) === 2000)
    if (Number(code) === 2000) {
      this.$router
        .push({
          path: '/'
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  .loginBgWarp {
    width: 30%;
    height: 100%;
    .loginBg {
      width: 100%;
      height: 100%;
      background: url('../../assets/images/loginBg.png') no-repeat;
      background-size: cover;
      background-position: center center;
    }
  }
  .loginMainWarp {
    width: 70%;
    height: 100%;
  }
  .loginMain {
    width: 36%;
    padding-top: 220px;
    margin: 0 auto;
    .logo {
      .logoImg {
        width: 40px;
        height: 40px;
      }
      h1 {
        margin-left: 10px;
        line-height: 40px;
        font-size: 20px;
        font-family: cursive;
      }
    }
    .loginContent {
      width: 100%;
      .header {
        line-height: 80px;
        letter-spacing: 4px;
        width: 80%;
        font-weight: 700;
      }
      .buttonClick {
        padding-top: 60px;
        .el-button {
          width: 100%;
          border-radius: 100px;
        }
      }
      .el-input__inner {
        border-width: 0px 0px 1px;
      }
    }
  }
}
</style>
