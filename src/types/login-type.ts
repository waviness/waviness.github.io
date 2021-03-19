/**
 * 定义当前数据
 */
export interface LoginValidate {
  userCode: string;
  password: string;
  Yzm?: string;
  verifyKey?: string;
  secretKey?: string | null;
  ifGetVerify?: boolean;
}
/**
 * 定义当前表单验证
 */
export interface LoginRules {
  userCode: LoginRuleOne[];
  password: LoginRuleOne[];
  Yzm: LoginRuleOne[];
}
interface LoginRuleOne {
  min?: number;
  max?: number;
  required?: boolean;
  trigger: string | string[];
  message: string;
}
