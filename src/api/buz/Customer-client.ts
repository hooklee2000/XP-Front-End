import { http } from "@/utils/http";

export interface CustomerListCommand extends BasePageQuery {
  // 顾客ID
  id?: number;
  // 微信openid
  openid?: string;
  // 微信unionid
  unionid?: string;
  // 微信昵称
  nickname?: string;
  // 手机号
  phone?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 县
  county?: string;
  // 头像地址
  avatarUrl?: string;
  // 累计中奖金额
  totalWinningAmount?: number;
  // 累计提现金额
  totalWithdrawAmount?: number;
  // 今日到账金额（风控）
  todayReceiveAmount?: number;
  // 风险等级
  riskLevel?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 是否同意顾客使用协议
  agreedUserProtocol?: number;
  // 协议确认时间
  agreedProtocolTime?: Date;
  // 最后登录IP
  lastLoginIp?: string;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export interface CustomerPageResponse {
  createTime?: Date;
  // 顾客ID
  id?: number;
  // 微信openid
  openid?: string;
  // 微信unionid
  unionid?: string;
  // 微信昵称
  nickname?: string;
  // 手机号
  phone?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 县
  county?: string;
  // 头像地址
  avatarUrl?: string;
  // 累计中奖金额
  totalWinningAmount?: number;
  // 累计提现金额
  totalWithdrawAmount?: number;
  // 今日到账金额（风控）
  todayReceiveAmount?: number;
  // 风险等级
  riskLevel?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 是否同意顾客使用协议
  agreedUserProtocol?: number;
  // 协议确认时间
  agreedProtocolTime?: Date;
  // 最后登录IP
  lastLoginIp?: string;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export function getCustomerListApi(params: CustomerListCommand) {
  return http.request<ResponseData<PageDTO<CustomerPageResponse>>>(
    "get",
    "/buz/customer/list",
    {
      params
    }
  );
}

export const exportCustomerExcelApi = (
  params: CustomerListCommand,
  fileName: string
) => {
  return http.download("/buz/customer/excel", fileName, {
    params
  });
};

export const deleteCustomerApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/customer", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface CustomerAddCommand {
  // 顾客ID
  id?: number;
  // 微信openid
  openid?: string;
  // 微信unionid
  unionid?: string;
  // 微信昵称
  nickname?: string;
  // 手机号
  phone?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 县
  county?: string;
  // 头像地址
  avatarUrl?: string;
  // 累计中奖金额
  totalWinningAmount?: number;
  // 累计提现金额
  totalWithdrawAmount?: number;
  // 今日到账金额（风控）
  todayReceiveAmount?: number;
  // 风险等级
  riskLevel?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 是否同意顾客使用协议
  agreedUserProtocol?: number;
  // 协议确认时间
  agreedProtocolTime?: Date;
  // 最后登录IP
  lastLoginIp?: string;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export const addCustomerApi = (data: CustomerAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/customer", {
    data
  });
};

export interface CustomerUpdateCommand extends CustomerAddCommand {
  id: number;
}

export const updateCustomerApi = (data: CustomerUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/customer", {
    data
  });
};
