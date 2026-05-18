import { http } from "@/utils/http";

export interface CashierListCommand extends BasePageQuery {
  // 收银员ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 收银员工号
  cashierCode?: string;
  // 姓名
  name?: string;
  // 手机号码
  phone?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface CashierPageResponse {
  createTime?: Date;
  // 收银员ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 收银员工号
  cashierCode?: string;
  // 姓名
  name?: string;
  // 手机号码
  phone?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getCashierListApi(params: CashierListCommand) {
  return http.request<ResponseData<PageDTO<CashierPageResponse>>>(
    "get",
    "/buz/cashier/list",
    {
      params
    }
  );
}

export const exportCashierExcelApi = (
  params: CashierListCommand,
  fileName: string
) => {
  return http.download("/buz/cashier/excel", fileName, {
    params
  });
};

export const deleteCashierApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/cashier", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface CashierAddCommand {
  // 收银员ID
  id?: number;
  // 所属门店
  storeId?: number;
  // 收银员工号
  cashierCode?: string;
  // 姓名
  name?: string;
  // 手机号码
  phone?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addCashierApi = (data: CashierAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/cashier", {
    data
  });
};

export interface CashierUpdateCommand extends CashierAddCommand {
  id: number;
}

export const updateCashierApi = (data: CashierUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/cashier", {
    data
  });
};
