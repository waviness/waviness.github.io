/**
 * 添加部门信息定义当前数据
 */
export interface depruleFormValidate {
  depName: string;
  depDesc: string;
  belongDep?: string;
}
export interface deprulesValidate {
  depName: deprulesOne[];
  depDesc: deprulesOne[];
  belongDep?: deprulesOne[];
}
interface deprulesOne {
  min?: number;
  max?: number;
  required?: boolean;
  trigger: string | string[];
  message: string;
}
export interface departSelectChangeValidate {
  id: string;
  value: string;
  code: string;
}
/**
 * 添加标签信息定义当前数据
 */
export interface tagFormValidate {
  tagName: string;
  tagEgn: string;
  tagDic: string;
  tagType: string;
}
export interface tagrulesValidate {
  tagName: deprulesOne[];
  tagEgn: deprulesOne[];
  tagDic: deprulesOne[];
  tagType: deprulesOne[];
}
/**
 * 添加人员信息定义当前数据
 */
export interface personValidate {
  userId?: string; // 用户id
  userCode: string; // 用户名
  userName: string; // 真实姓名
  userType: number; // 用户类型
  wxCode: string; // 微信号
  emailAddress: string; // 邮箱
  gender: number; // 性别
  phoneNum: string; // 电话
  telNum: string; // 座机
  roleId: number | string; // 角色
  userLeaderId: number | string; // 上级领导id
  userLeaderName?: string; // 上级领导名称
  userMainDepName?: string; // 主部门名称
  userMainDepNum: number | string; // 主部门id
  pm4PersonConcat?: string | []
}
export interface personrulesValidate {
  userId?: deprulesOne[]; // 用户id
  userCode: deprulesOne[]; // 用户名
  userName: deprulesOne[]; // 真实姓名
  userType?: deprulesOne[]; // 用户类型
  wxCode: deprulesOne[]; // 微信号
  emailAddress: deprulesOne[]; // 邮箱
  gender?: deprulesOne[]; // 性别
  phoneNum: deprulesOne[]; // 电话
  telNum: deprulesOne[]; // 座机
  roleId: deprulesOne[]; // 角色
  userLeaderId: deprulesOne[]; // 上级领导id
  userLeaderName?: deprulesOne[]; // 上级领导名称
  userMainDepName?: deprulesOne[]; // 主部门名称
  userMainDepNum: deprulesOne[]; // 主部门id
}