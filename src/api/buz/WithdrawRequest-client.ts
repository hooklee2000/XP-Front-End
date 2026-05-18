import { http } from "@/utils/http";

export interface WithdrawRequestListCommand extends BasePageQuery {
  // 提现申请ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 提现金额
  amount?: number;
  // 手续费
  feeAmount?: number;
  // 实际到账金额
  actualAmount?: number;
  // 状态(1已经提现 0申请提现)
  status?: number;
  // 申请时间
  applyTime?: Date;
  // 打款时间
  payTime?: Date;
  // 操作员
  operatorName?: string;
  // 备注
  remark?: string;
  // 创建时间
  createdTime?: Date;
}

export interface WithdrawRequestPageResponse {
  createTime?: Date;
  // 提现申请ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 提现金额
  amount?: number;
  // 手续费
  feeAmount?: number;
  // 实际到账金额
  actualAmount?: number;
  // 状态(1已经提现 0申请提现)
  status?: number;
  // 申请时间
  applyTime?: Date;
  // 打款时间
  payTime?: Date;
  // 操作员
  operatorName?: string;
  // 备注
  remark?: string;
  // 创建时间
  createdTime?: Date;
}

export function getWithdrawRequestListApi(params: WithdrawRequestListCommand) {
  return http.request<ResponseData<PageDTO<WithdrawRequestPageResponse>>>(
    "get",
    "/buz/withdrawRequest/list",
    {
      params
    }
  );
}

export const exportWithdrawRequestExcelApi = (
  params: WithdrawRequestListCommand,
  fileName: string
) => {
  return http.download("/buz/withdrawRequest/excel", fileName, {
    params
  });
};

export const deleteWithdrawRequestApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/withdrawRequest", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface WithdrawRequestAddCommand {
  // 提现申请ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 提现金额
  amount?: number;
  // 手续费
  feeAmount?: number;
  // 实际到账金额
  actualAmount?: number;
  // 状态(1已经提现 0申请提现)
  status?: number;
  // 申请时间
  applyTime?: Date;
  // 打款时间
  payTime?: Date;
  // 操作员
  operatorName?: string;
  // 备注
  remark?: string;
  // 创建时间
  createdTime?: Date;
}

export const addWithdrawRequestApi = (data: WithdrawRequestAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/withdrawRequest", {
    data
  });
};

export interface WithdrawRequestUpdateCommand extends WithdrawRequestAddCommand {
  id: number;
}

export const updateWithdrawRequestApi = (data: WithdrawRequestUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/withdrawRequest", {
    data
  });
};
