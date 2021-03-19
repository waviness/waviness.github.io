/**
 * type为1 表示是打包线上环境 即 带/client
 * type为0 表示线下测试 或发线上测试环境 即 不带/client
 */
const type: number = 0
let HOST = ''
export let HOST2 = ''
console.log(process.env.VUE_APP_URL)
switch (type) {
  case 1:
    HOST = process.env.NODE_ENV === 'development' ? '/webapi' : '/client'
    HOST2 = process.env.NODE_ENV === 'development' ? '/ytapi' : '/client'
    break
  case 0:
    HOST = process.env.NODE_ENV === 'development' ? '/webapi' : process.env.VUE_APP_WEBURL
    HOST2 = process.env.NODE_ENV === 'development' ? '/ytapi' : process.env.VUE_APP_URL
    break
  default:
    break
}

export default HOST
