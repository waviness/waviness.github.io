import http from '@/utils/requset'
import HOST, { HOST2 } from '../getHost'
// post
async function postAction(HOST: string, url: string, parameter: any) {
  const res: any = await http({
    url: HOST + url,
    method: 'post',
    data: parameter
  })
  return res.data
}

// formData
async function formDataAction(HOST: string, url: string, parameter: any) {
  const data = new FormData()
  Object.keys(parameter).forEach((key) => {
    data.append(key, parameter[key] || '')
  })
  const res: any = await http({
    url: HOST + url,
    method: 'post',
    data
  })
  return res.data
}
/**
 * @description: 新增部门信息
 * @param {*} params
 */
export const insOrUpdDepList = async (params: any) => {
  return await postAction(HOST, '/api/Dep/insOrUpdDepList', params)
}
/**
 * @description: 删除部门信息
 * @param {*} params
 */
export const dltDepList = async (params: any) => {
  return await postAction(HOST, '/api/Dep/dltDepList', params)
}
/**
 * @description: 根据部门ID获取管理人员信息
 * @param {*} params
 */
export const getDepMngByDepId = async (params: any) => {
  return await formDataAction(HOST, '/api/DepMng/getDepMngByDepId', params)
}
/**
 * @description: 添加管理人员 根据部门Id获取人员信息 下拉选择
 * @param {*} params
 */
export const getUserByDepId = async (params: any) => {
  return await formDataAction(HOST, '/api/WebAppUser/getUserByDepId', params)
}
/**
 * @description: 新增或修改部门管理人员信息
 * @param {*} params
 */
export const insOrUpdDepMng = async (params: any) => {
  return await postAction(HOST, '/api/DepMng/insOrUpdDepMng', params)
}
/**
 * @description: 根据部门管理人员ID删除部门管理人员信息
 * @param {*} params
 */
export const dltDepMng = async (params: any) => {
  return await postAction(HOST, '/api/DepMng/dltDepMng', params)
}
/**
 * @description: 新增或修改标签信息
 * @param {*} params
 */
export const insOrUpdUsertag = async (params: any) => {
  return await postAction(HOST, '/api/UserTag/insOrUpdUsertag', params)
}
/**
 * @description: 根据标签ID删除标签
 * @param {*} params
 */
export const dltUsertag = async (params: any) => {
  return await postAction(HOST, '/api/UserTag/dltUsertag', params)
}
/**
 * @description: 根据标签ID获取标签详情
 * @param {*} params
 */
export const getUsertag = async (params: any) => {
  // return await formDataAction(HOST, '/api/UserTag/dltUsertag', params)
  const url = HOST + '/api/UserTag/getUsertag?tagId=' + params.tagId
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
 * @description: 新增或修改人员标签信息
 * @param {*} params
 */
export const insOrUpdUserUsertag = async (params: any) => {
  return await postAction(HOST, '/api/UserTag/insOrUpdUserUsertag', params)
}
/**
 * @description: 根据标签ID + 部门id 获取人员信息 这样的话渲染出已经选择过的人员 已选人员不做选择
 * @param {*} params
 */
export const getUserByParams = async (params: any) => {
  return await formDataAction(HOST, '/api/WebAppUser/getUserByParams', params)
}
/**
 * @description: 查询人员详细信息
 * @param {*} params
 */
export const getUserDetailList = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/getUserDetailList', params)
}
/**
 * @description: 根据所选人员获取共有的部门关系信息
 * @param {*} params
 */
export const getCrmDepByUserIds = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/getCrmDepByUserIds', params)
}
/**
 * @description: 新增或删除部门人员关系
 * @param {*} params
 */
export const insOrDltUserDep = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/insOrDltUserDep', params)
}
/**
 * @description: 根据所选人员获取共有的角色信息
 * @param {*} params
 */
export const getCrmRoleByUserIds = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/getCrmRoleByUserIds', params)
}
/**
 * @description: 新增或删除人员角色关系
 * @param {*} params
 */
export const insOrDltRoleDep = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/insOrDltRoleDep', params)
}
/**
 * @description: 新增或删除小组人员关系
 * @param {*} params
 */
export const insOrDltUserGroup = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/insOrDltUserGroup', params)
}
/**
 * @description: 查找PM4人员基础信息
 * @param {*} params
 */
export const getPubEmpList = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/getPubEmpList', params)
}
/**
 * @description: 新增或删除人员PM4人员关系
 * @param {*} params
 */
export const insOrDltUserEmp = async (params: any) => {
  return await postAction(HOST, '/api/UserDep/insOrDltUserEmp', params)
}
/**
 * @description: 删除人员信息
 * @param {*} params
 */
export const dltUserList = async (params: any) => {
  return await postAction(HOST, '/api/WebAppUser/dltUserList', params)
}
/**
 * @description: 创建用户
 * @param {*} params
 */
export const createUser = async (params: any) => {
  return await postAction(HOST2, '/api/user/createUser', params)
}
/**
 * @description: 编辑用户
 * @param {*} params
 */
export const editUser = async (params: any) => {
  return await postAction(HOST2, '/api/user/editUser', params)
}
/**
 * @description: 重置密码
 * @param {*} params
 */
export const resetPwd = async (params: any) => {
  return await formDataAction(HOST2, '/api/user/resetPwd', params)
}
