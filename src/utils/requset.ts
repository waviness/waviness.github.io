import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
(window as any).canCancelAxios = []
// 全局设置 axios 发送请求带上cookie
// axios.defaults.withCredentials = true
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 300000
})
// 请求
service.interceptors.request.use(
  (config: any) => {
    const whiteList: Array<[]> = [] // 白名单接口
    if (config.url && whiteList.every(item => !config.url.includes(item))) {
      config.cancelToken = new axios.CancelToken(function (c) {
        const temp = config.url.split('/');
        (window as any).canCancelAxios.push({ key: temp[temp.length - 1] || '', cancel: c })
      })
    }
    config.headers['X-TOKEN'] = localStorage.getItem('tokenValue')
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应
service.interceptors.response.use(
  response => {
    const { status, statusText, data } = response
    if (status === 200) {
      if (data.code === 'LG00004') {
        const errInfo = 'token已失效，请重新登陆'
        localStorage.clear()
        router.push({
          path: '/'
        })
        Message({
          showClose: true,
          message: errInfo,
          type: 'error'
        })
        return Promise.reject(new Error(data.msg || 'Error'))
      }
      return Promise.resolve(response)
    } else {
      const err = { info: '' }
      switch (status) {
        case 400:
          err.info = '请求无效'
          break
        case 401:
          err.info = '由于长时间未操作，登录已超时，请重新登录'
          router.replace({
            path: '/'
          })
          break
        case 403:
          err.info = '拒绝访问'
          break
        case 404:
          err.info = '请求地址出错'
          break
        case 405:
          err.info = '未授权'
          break
        case 408:
          err.info = '请求超时'
          break
        case 500:
          err.info = '服务器内部错误'
          break
        case 501:
          err.info = '服务未实现'
          break
        case 502:
          err.info = '网关错误'
          break
        case 503:
          err.info = '服务不可用'
          break
        case 504:
          err.info = '网关超时'
          break
        case 505:
          err.info = 'HTTP版本不受支持'
          break
        default:
          err.info = '网络波动，请重试'
      }
      const messInfo = statusText ? err.info + ' ' + statusText : err.info
      return Promise.reject(new Error(messInfo || 'Error'))
    }
  },
  err => {
    console.log('响应错误：' + err)
    return Promise.reject(err) // 请求错误时，直接结束
  }
)
/**
 * 取消axios请求
 * @param cellArr 要取消的接口；如果不传参，则取消canCancelAxios保存的所有接口
 */
export function cancelAxios(cellArr = []) {
  const _window: any = window
  console.log(_window)
  console.log(cellArr)
  if (cellArr.length > 0) {
    cellArr.forEach(val => {
      console.log(_window.canCancelAxios)
      for (let i = 0; i < _window.canCancelAxios.length; i++) {
        if (_window.canCancelAxios[i].key === val) {
          _window.canCancelAxios[i].cancel('中断请求')
          _window.canCancelAxios.splice(i, 1)
          i--
        }
      }
    })
  } else {
    console.log(_window.canCancelAxios)
    for (let i = 0; i < _window.canCancelAxios.length; i++) {
      _window.canCancelAxios[i].cancel('中断请求')
      _window.canCancelAxios.splice(i, 1)
      i--
    }
  }
}
export default service
