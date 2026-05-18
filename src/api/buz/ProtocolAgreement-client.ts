import { http } from "@/utils/http";

export interface ProtocolAgreementListCommand extends BasePageQuery {
  // 协议记录ID
  id?: number;
  // 协议记录ID
  customerId?: number;
  // 协议类别
  protocolType?: string;
  // 协议版本
  protocolVersion?: string;
  // 是否同意
  agreed?: number;
  // 同意时间
  agreedTime?: Date;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface ProtocolAgreementPageResponse {
  createTime?: Date;
  // 协议记录ID
  id?: number;
  // 协议记录ID
  customerId?: number;
  // 协议类别
  protocolType?: string;
  // 协议版本
  protocolVersion?: string;
  // 是否同意
  agreed?: number;
  // 同意时间
  agreedTime?: Date;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getProtocolAgreementListApi(params: ProtocolAgreementListCommand) {
  return http.request<ResponseData<PageDTO<ProtocolAgreementPageResponse>>>(
    "get",
    "/buz/protocolAgreement/list",
    {
      params
    }
  );
}

export const exportProtocolAgreementExcelApi = (
  params: ProtocolAgreementListCommand,
  fileName: string
) => {
  return http.download("/buz/protocolAgreement/excel", fileName, {
    params
  });
};

export const deleteProtocolAgreementApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/protocolAgreement", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface ProtocolAgreementAddCommand {
  // 协议记录ID
  id?: number;
  // 协议记录ID
  customerId?: number;
  // 协议类别
  protocolType?: string;
  // 协议版本
  protocolVersion?: string;
  // 是否同意
  agreed?: number;
  // 同意时间
  agreedTime?: Date;
  // IP
  ip?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addProtocolAgreementApi = (data: ProtocolAgreementAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/protocolAgreement", {
    data
  });
};

export interface ProtocolAgreementUpdateCommand extends ProtocolAgreementAddCommand {
  id: number;
}

export const updateProtocolAgreementApi = (data: ProtocolAgreementUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/protocolAgreement", {
    data
  });
};
