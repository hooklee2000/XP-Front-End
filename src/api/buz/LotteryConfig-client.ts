import { http } from "@/utils/http";

export interface LotteryConfigListCommand extends BasePageQuery {
  // 配置ID
  id?: number;
  // 门店ID
  storeId?: number;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 中奖概率
  probability?: number;
  // 每日限制
  dailyLimit?: number;
  // 每周限制
  weeklyLimit?: number;
  // 每月限制
  monthlyLimit?: number;
  // 是否大奖
  isSpecialPrize?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface LotteryConfigPageResponse {
  createTime?: Date;
  // 配置ID
  id?: number;
  // 门店ID
  storeId?: number;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 中奖概率
  probability?: number;
  // 每日限制
  dailyLimit?: number;
  // 每周限制
  weeklyLimit?: number;
  // 每月限制
  monthlyLimit?: number;
  // 是否大奖
  isSpecialPrize?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getLotteryConfigListApi(params: LotteryConfigListCommand) {
  return http.request<ResponseData<PageDTO<LotteryConfigPageResponse>>>(
    "get",
    "/buz/lotteryConfig/list",
    {
      params
    }
  );
}

export const exportLotteryConfigExcelApi = (
  params: LotteryConfigListCommand,
  fileName: string
) => {
  return http.download("/buz/lotteryConfig/excel", fileName, {
    params
  });
};

export const deleteLotteryConfigApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/lotteryConfig", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface LotteryConfigAddCommand {
  // 配置ID
  id?: number;
  // 门店ID
  storeId?: number;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 中奖概率
  probability?: number;
  // 每日限制
  dailyLimit?: number;
  // 每周限制
  weeklyLimit?: number;
  // 每月限制
  monthlyLimit?: number;
  // 是否大奖
  isSpecialPrize?: number;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addLotteryConfigApi = (data: LotteryConfigAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/lotteryConfig", {
    data
  });
};

export interface LotteryConfigUpdateCommand extends LotteryConfigAddCommand {
  id: number;
}

export const updateLotteryConfigApi = (data: LotteryConfigUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/lotteryConfig", {
    data
  });
};
