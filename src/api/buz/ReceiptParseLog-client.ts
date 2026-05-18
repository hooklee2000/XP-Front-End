import { http } from "@/utils/http";

export interface ReceiptParseLogListCommand extends BasePageQuery {
  // 日志ID
  id?: number;
  // 顾客ID
  receiptOrderId?: number;
  // 解析版本
  parserVersion?: string;
  // 原始文本
  rawText?: string;
  // 解析结果
  parsedJson?: string;
  // 是否成功
  success?: number;
  // 错误信息
  errorMsg?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface ReceiptParseLogPageResponse {
  createTime?: Date;
  // 日志ID
  id?: number;
  // 顾客ID
  receiptOrderId?: number;
  // 解析版本
  parserVersion?: string;
  // 原始文本
  rawText?: string;
  // 解析结果
  parsedJson?: string;
  // 是否成功
  success?: number;
  // 错误信息
  errorMsg?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getReceiptParseLogListApi(params: ReceiptParseLogListCommand) {
  return http.request<ResponseData<PageDTO<ReceiptParseLogPageResponse>>>(
    "get",
    "/buz/receiptParseLog/list",
    {
      params
    }
  );
}

export const exportReceiptParseLogExcelApi = (
  params: ReceiptParseLogListCommand,
  fileName: string
) => {
  return http.download("/buz/receiptParseLog/excel", fileName, {
    params
  });
};

export const deleteReceiptParseLogApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/receiptParseLog", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface ReceiptParseLogAddCommand {
  // 日志ID
  id?: number;
  // 顾客ID
  receiptOrderId?: number;
  // 解析版本
  parserVersion?: string;
  // 原始文本
  rawText?: string;
  // 解析结果
  parsedJson?: string;
  // 是否成功
  success?: number;
  // 错误信息
  errorMsg?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addReceiptParseLogApi = (data: ReceiptParseLogAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/receiptParseLog", {
    data
  });
};

export interface ReceiptParseLogUpdateCommand extends ReceiptParseLogAddCommand {
  id: number;
}

export const updateReceiptParseLogApi = (data: ReceiptParseLogUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/receiptParseLog", {
    data
  });
};
