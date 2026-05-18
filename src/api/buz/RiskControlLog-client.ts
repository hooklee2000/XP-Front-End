import { http } from "@/utils/http";

export interface RiskControlLogListCommand extends BasePageQuery {
  // 风控日志ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 风险类别
  riskType?: string;
  // 风险级别
  riskLevel?: string;
  // 描述
  description?: string;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface RiskControlLogPageResponse {
  createTime?: Date;
  // 风控日志ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 风险类别
  riskType?: string;
  // 风险级别
  riskLevel?: string;
  // 描述
  description?: string;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getRiskControlLogListApi(params: RiskControlLogListCommand) {
  return http.request<ResponseData<PageDTO<RiskControlLogPageResponse>>>(
    "get",
    "/buz/riskControlLog/list",
    {
      params
    }
  );
}

export const exportRiskControlLogExcelApi = (
  params: RiskControlLogListCommand,
  fileName: string
) => {
  return http.download("/buz/riskControlLog/excel", fileName, {
    params
  });
};

export const deleteRiskControlLogApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/riskControlLog", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface RiskControlLogAddCommand {
  // 风控日志ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 风险类别
  riskType?: string;
  // 风险级别
  riskLevel?: string;
  // 描述
  description?: string;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addRiskControlLogApi = (data: RiskControlLogAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/riskControlLog", {
    data
  });
};

export interface RiskControlLogUpdateCommand extends RiskControlLogAddCommand {
  id: number;
}

export const updateRiskControlLogApi = (data: RiskControlLogUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/riskControlLog", {
    data
  });
};
