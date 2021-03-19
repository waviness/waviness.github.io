import http from '@/utils/requset'
import { HOST2 } from './getHost'
// 登录
export const login = async (loginParams: any) => {
  // const url = HOST + '/login'
  // let result = null
  // try {
  //   result = await http.post(url, params)
  //   if (result.status === 200) {
  //     return Promise.resolve(result.data)
  //   }
  // } catch (e) {
  //   console.log(e)
  // }
  // return result
  // console.log(loginParams)
  // // 模拟登陆
  // const url = HOST + '/login'
  // let result = null
  // try {
  //   result = await http.get(url)
  //   if (result.status === 200) {
  //     return Promise.resolve(result.data)
  //   }
  // } catch (e) {
  //   console.log(e)
  // }
  // return result
  const res = await http({
    url: HOST2 + '/api/login/doLogin',
    method: 'post',
    data: loginParams
  })
  return res.data
}

// 获取公钥
export const getKey = async () => {
  const res = await http({
    url: HOST2 + '/api/login/getKey',
    method: 'post'
  })
  return res.data
}

// 退出登录
export const logout = async () => {
  const res = await http({
    url: HOST2 + '/api/login/doLogout',
    method: 'post'
  })
  return res.data
}

// 修改密码
export const updatePwd = async (params: any) => {
  const res = await http({
    url: HOST2 + '/api/user/updatePwd',
    method: 'post',
    data: params
  })
  return res.data
}

// 修改头像
export const updateHeadImgUrl = async (params: any) => {
  const res = await http({
    url: HOST2 + '/api/user/updateHeadImgUrl',
    method: 'post',
    data: params
  })
  return res.data
}
