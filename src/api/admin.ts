import http from '@/utils/requset'
import { HOST2 } from './getHost'

// post
async function postAction(url: string, parameter: any) {
  const res: any = await http({
    url: HOST2 + url,
    method: 'post',
    data: parameter
  })
  return res.data
}

// formData
async function formDataAction(url: string, parameter: any) {
  const data = new FormData()
  Object.keys(parameter).forEach((key) => {
    data.append(key, parameter[key] || '')
  })
  const res: any = await http({
    url: HOST2 + url,
    method: 'post',
    data
  })
  return res.data
}

// 获取全部菜单
export async function queryMenuList(params: any) {
  return await formDataAction('/api/pms/getPmsTree', params)
}

// 通过id查询权限与子权限
export async function queryMenuListById(params: any) {
  return await formDataAction('/api/pms/findById', params)
}

// 新增菜单
export async function addMenu(params: any) {
  return await formDataAction('/api/pms/create', params)
}

// 修改菜单
export async function updateMenu(params: any) {
  return await formDataAction('/api/pms/update', params)
}

// 根据id删除菜单
export async function deleteMenuById(params: any) {
  return await formDataAction('/api/pms/deleteById', params)
}

// 获取角色列表
export async function getRoles(params: any) {
  return await formDataAction('/api/role/getRoles', params)
}

// 获取角色详情
export async function getRoleInfo(params: any) {
  return await formDataAction('/api/role/getRoleInfo', params)
}

// 新增角色
export async function createRole(params: any) {
  return await postAction('/api/role/createRole', params)
}

// 修改角色
export async function updateRole(params: any) {
  return await postAction('/api/role/updateRole', params)
}

// 根据id删除角色
export async function deleteRoleById(params: any) {
  return await formDataAction('/api/role/delete', params)
}
