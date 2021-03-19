import { SET_INFORMATION, SET_HEADERACTIVEINDEX } from '../mutation-types'
import { LoginValidate } from '@/types/login-type'
import { login, getKey } from '@/api/login'
import router from '@/router/index'
import { Message, Loading } from 'element-ui'
import { JSEncrypt } from 'jsencrypt'
interface StateDataProps {
  userInfor: any;
  headerActiveIndex: string;
}
const user = {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称 避免命名冲突
  state: {
    userInfor: 123,
    headerActiveIndex: ''
  },
  mutations: {
    [SET_INFORMATION](state: StateDataProps, userInfor: object) {
      console.log(userInfor)
      state.userInfor = userInfor
    },
    [SET_HEADERACTIVEINDEX](state: StateDataProps, headerActiveIndex: string) {
      state.headerActiveIndex = headerActiveIndex
    }
  },
  actions: {
    actionChangeInfor({ commit }: any, data: any) {
      commit('SET_INFORMATION', data)
    },
    // loginParams: LoginValidate
    async actionLogin({ commit }: any, loginParams: LoginValidate) {
      console.log(commit)
      const loading = Loading.service({
        text: '登陆中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, .7)'
      })
      const uuidRes = await getKey()
      const encryptor = new JSEncrypt({})
      // 设置公钥
      encryptor.setPublicKey(uuidRes.data.publicKey)
      // 加密数据
      const newPass: any = encryptor.encrypt(loginParams.password)
      const formData = new FormData()
      formData.append('type', '1')
      formData.append('userCode', loginParams.userCode)
      formData.append('password', newPass)
      formData.append('uuid', uuidRes.data.uuid)
      const res = await login(formData)
      loading.close()
      const currentTime = new Date().getTime()
      const pastTime = 0.25 * 24 * 60 * 60 * 1000 // 6小时
      if (res.success || res.errorcode === '2000') {
        Message({
          showClose: true,
          message: '登陆成功',
          type: 'success'
        })
        localStorage.setItem('tokenValue', res.data.token)
        localStorage.setItem('loginTime', JSON.stringify(currentTime + pastTime))
        localStorage.setItem('loginCode', res.code)
        localStorage.setItem('userName', res.data.userName)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('userCode', res.data.userCode)
        localStorage.setItem('headImgUrl', res.data.headImgUrl)
        if (res.data.resListTree) {
          const menu: any = []
          const adminMenu: any = []
          res.data.resListTree.forEach((val: any) => {
            if (val.pmsName === '后台管理系统') {
              adminMenu.push(val)
            } else {
              menu.push(val)
            }
          })
          localStorage.setItem('menu', JSON.stringify(menu))
          localStorage.setItem('adminMenu', JSON.stringify(adminMenu[0]))
        }
        const redirect: any = router.currentRoute.query.redirect || ''
        if (redirect) {
          router.replace({ path: redirect || '/' })
        } else {
          router.replace({ path: '/' })
        }
        // location.reload()
      } else {
        Message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
    }
  }
}
export default user
