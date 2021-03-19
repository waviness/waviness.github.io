import http from '@/utils/requset'
import HOST from '@/api/getHost'
// 新增数据字典
export const insDictionaries = async (params: any) => {
  const url = HOST + '/api/dictionary/insDictionaries'
  let result = null
  try {
    result = await http.post(url, params)
    if (result.status === 200) {
      return Promise.resolve(result.data)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}
// 查询数据字典
export const getDictionaries = async (params: any) => {
  const url = HOST + '/api/dictionary/getDictionaries'
  let result = null
  try {
    result = await http.post(url, params)
    if (result.status === 200) {
      return Promise.resolve(result.data)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}
// 删除数据字典
export const dltDictionaries = async (params: any) => {
  const url = HOST + '/api/dictionary/dltDictionaries'
  let result = null
  try {
    result = await http.post(url, params)
    if (result.status === 200) {
      return Promise.resolve(result.data)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}
