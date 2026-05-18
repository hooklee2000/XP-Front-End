import { http } from "@/utils/http";

export interface StoreListCommand extends BasePageQuery {
  // 门店ID
  id?: number;
  // 门店全称
  name?: string;
  // 门店简称（滚动展示）
  shortName?: string;
  // 品牌名称
  brand?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 区县
  county?: string;
  // 街道镇乡
  street?: string;
  // 详细地址
  address?: string;
  // 联系负责人
  contactPerson?: string;
  // 联系人电话
  contactPhone?: string;
  // 营业执照号
  businessLicenseNo?: string;
  // 是否启用抽奖
  lotteryEnabled?: number;
  // 最低抽奖金额
  lotteryMinAmount?: number;
  // 每日预算
  dailyBudget?: number;
  // 每月预算
  monthlyBudget?: number;
  // 服务费比例
  serviceFeeRate?: number;
  // 目标增长营业额
  targetGrowthAmount?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export interface StorePageResponse {
  createTime?: Date;
  // 门店ID
  id?: number;
  // 门店全称
  name?: string;
  // 门店简称（滚动展示）
  shortName?: string;
  // 品牌名称
  brand?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 区县
  county?: string;
  // 街道镇乡
  street?: string;
  // 详细地址
  address?: string;
  // 联系负责人
  contactPerson?: string;
  // 联系人电话
  contactPhone?: string;
  // 营业执照号
  businessLicenseNo?: string;
  // 是否启用抽奖
  lotteryEnabled?: number;
  // 最低抽奖金额
  lotteryMinAmount?: number;
  // 每日预算
  dailyBudget?: number;
  // 每月预算
  monthlyBudget?: number;
  // 服务费比例
  serviceFeeRate?: number;
  // 目标增长营业额
  targetGrowthAmount?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export function getStoreListApi(params: StoreListCommand) {
  return http.request<ResponseData<PageDTO<StorePageResponse>>>(
    "get",
    "/buz/store/list",
    {
      params
    }
  );
}

export const exportStoreExcelApi = (
  params: StoreListCommand,
  fileName: string
) => {
  return http.download("/buz/store/excel", fileName, {
    params
  });
};

export const deleteStoreApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/store", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface StoreAddCommand {
  // 门店ID
  id?: number;
  // 门店全称
  name?: string;
  // 门店简称（滚动展示）
  shortName?: string;
  // 品牌名称
  brand?: string;
  // 省
  province?: string;
  // 市
  city?: string;
  // 区县
  county?: string;
  // 街道镇乡
  street?: string;
  // 详细地址
  address?: string;
  // 联系负责人
  contactPerson?: string;
  // 联系人电话
  contactPhone?: string;
  // 营业执照号
  businessLicenseNo?: string;
  // 是否启用抽奖
  lotteryEnabled?: number;
  // 最低抽奖金额
  lotteryMinAmount?: number;
  // 每日预算
  dailyBudget?: number;
  // 每月预算
  monthlyBudget?: number;
  // 服务费比例
  serviceFeeRate?: number;
  // 目标增长营业额
  targetGrowthAmount?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export const addStoreApi = (data: StoreAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/store", {
    data
  });
};

export interface StoreUpdateCommand extends StoreAddCommand {
  id: number;
}

export const updateStoreApi = (data: StoreUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/store", {
    data
  });
};
