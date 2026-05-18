import { http } from "@/utils/http";

export interface PosTerminalListCommand extends BasePageQuery {
  // POS终端ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 机号
  terminalNo?: string;
  // 设备序列号
  deviceSn?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface PosTerminalPageResponse {
  createTime?: Date;
  // POS终端ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 机号
  terminalNo?: string;
  // 设备序列号
  deviceSn?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getPosTerminalListApi(params: PosTerminalListCommand) {
  return http.request<ResponseData<PageDTO<PosTerminalPageResponse>>>(
    "get",
    "/buz/posTerminal/list",
    {
      params
    }
  );
}

export const exportPosTerminalExcelApi = (
  params: PosTerminalListCommand,
  fileName: string
) => {
  return http.download("/buz/posTerminal/excel", fileName, {
    params
  });
};

export const deletePosTerminalApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/posTerminal", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface PosTerminalAddCommand {
  // POS终端ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 机号
  terminalNo?: string;
  // 设备序列号
  deviceSn?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addPosTerminalApi = (data: PosTerminalAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/posTerminal", {
    data
  });
};

export interface PosTerminalUpdateCommand extends PosTerminalAddCommand {
  id: number;
}

export const updatePosTerminalApi = (data: PosTerminalUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/posTerminal", {
    data
  });
};
