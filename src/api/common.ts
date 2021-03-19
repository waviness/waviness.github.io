/*
 * @Description: 一些需复用的接口
 * @Version: 2.0
 */
import http from '@/utils/requset'
import HOST from './getHost'
/**
 * @description: 获取部门树结构
 * @param {*} params
 */
export const getDepTree = async (params: any) => {
  const url = HOST + '/api/Dep/getDepTree?treeType=' + params.treeType
  let result = null
  try {
    result = await http.get(url)
    if (result.status === 200) {
      return Promise.resolve(result.data)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}
/**
 * @description: 根据关键字查询人员、标签、部门信息
 * @param {*} async
 * @return {*}
 * @author: zhangning
 */
export const getUserAndDep = async (params: any) => {
  const url = HOST + '/api/UserDep/getUserAndDep?keyword=' + params.keyword + '&searchType=' + params.searchType
  let result = null
  try {
    result = await http.post(url)
    if (result.status === 200) {
      return Promise.resolve(result.data)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}
/**
 * @description: 查询数据字典
 * @param {*} async
 * @return {*}
 * @author: zhangning
 */
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
