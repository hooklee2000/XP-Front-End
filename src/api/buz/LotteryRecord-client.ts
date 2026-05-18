import { http } from "@/utils/http";

export interface LotteryRecordListCommand extends BasePageQuery {
  // 抽奖记录ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // 订单号
  receiptOrderId?: number;
  // 抽奖编号
  lotteryNo?: string;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 是否中奖
  isWinning?: number;
  // 抽奖时间
  lotteryTime?: Date;
  // 提现状态(1提现 0未提现)
  withdrawStatus?: number;
  // 状态(1已经提现 0申请提现 -1初始))
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface LotteryRecordPageResponse {
  createTime?: Date;
  // 抽奖记录ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // 订单号
  receiptOrderId?: number;
  // 抽奖编号
  lotteryNo?: string;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 是否中奖
  isWinning?: number;
  // 抽奖时间
  lotteryTime?: Date;
  // 提现状态(1提现 0未提现)
  withdrawStatus?: number;
  // 状态(1已经提现 0申请提现 -1初始))
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getLotteryRecordListApi(params: LotteryRecordListCommand) {
  return http.request<ResponseData<PageDTO<LotteryRecordPageResponse>>>(
    "get",
    "/buz/lotteryRecord/list",
    {
      params
    }
  );
}

export const exportLotteryRecordExcelApi = (
  params: LotteryRecordListCommand,
  fileName: string
) => {
  return http.download("/buz/lotteryRecord/excel", fileName, {
    params
  });
};

export const deleteLotteryRecordApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/lotteryRecord", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface LotteryRecordAddCommand {
  // 抽奖记录ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // 订单号
  receiptOrderId?: number;
  // 抽奖编号
  lotteryNo?: string;
  // 奖项名称
  prizeName?: string;
  // 中奖金额
  prizeAmount?: number;
  // 是否中奖
  isWinning?: number;
  // 抽奖时间
  lotteryTime?: Date;
  // 提现状态(1提现 0未提现)
  withdrawStatus?: number;
  // 状态(1已经提现 0申请提现 -1初始))
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addLotteryRecordApi = (data: LotteryRecordAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/lotteryRecord", {
    data
  });
};

export interface LotteryRecordUpdateCommand extends LotteryRecordAddCommand {
  id: number;
}

export const updateLotteryRecordApi = (data: LotteryRecordUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/lotteryRecord", {
    data
  });
};
