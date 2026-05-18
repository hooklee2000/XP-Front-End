import { http } from "@/utils/http";

export interface PosTerminalCashierListCommand extends BasePageQuery {
  // 关系ID
  id?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次
  shiftType?: string;
  // 上机时间
  startTime?: Date;
  // 下机时间
  endTime?: Date;
  // 当前是否有效
  isActive?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface PosTerminalCashierPageResponse {
  createTime?: Date;
  // 关系ID
  id?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次
  shiftType?: string;
  // 上机时间
  startTime?: Date;
  // 下机时间
  endTime?: Date;
  // 当前是否有效
  isActive?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getPosTerminalCashierListApi(params: PosTerminalCashierListCommand) {
  return http.request<ResponseData<PageDTO<PosTerminalCashierPageResponse>>>(
    "get",
    "/buz/posTerminalCashier/list",
    {
      params
    }
  );
}

export const exportPosTerminalCashierExcelApi = (
  params: PosTerminalCashierListCommand,
  fileName: string
) => {
  return http.download("/buz/posTerminalCashier/excel", fileName, {
    params
  });
};

export const deletePosTerminalCashierApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/posTerminalCashier", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface PosTerminalCashierAddCommand {
  // 关系ID
  id?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次
  shiftType?: string;
  // 上机时间
  startTime?: Date;
  // 下机时间
  endTime?: Date;
  // 当前是否有效
  isActive?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addPosTerminalCashierApi = (data: PosTerminalCashierAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/posTerminalCashier", {
    data
  });
};

export interface PosTerminalCashierUpdateCommand extends PosTerminalCashierAddCommand {
  id: number;
}

export const updatePosTerminalCashierApi = (data: PosTerminalCashierUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/posTerminalCashier", {
    data
  });
};
