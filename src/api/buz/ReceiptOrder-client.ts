import { http } from "@/utils/http";

export interface ReceiptOrderListCommand extends BasePageQuery {
  // 订单ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次关系ID
  terminalCashierId?: number;
  // 小票单号
  receiptNo?: string;
  // 小票时间
  receiptTime?: Date;
  // 支付时间
  paymentTime?: Date;
  // 重打时间
  reprintTime?: Date;
  // 是否重打单
  isReprint?: number;
  // 会员号
  memberNo?: string;
  // 会员手机号
  memberPhone?: string;
  // 会员姓名
  memberName?: string;
  // 本次积分
  pointsEarned?: number;
  // 累计积分
  pointsTotal?: number;
  // 商品种类数
  totalItems?: number;
  // 商品总数量
  totalQuantity?: number;
  // 订单原价
  originalAmount?: number;
  // 优惠金额
  discountAmount?: number;
  // 优惠券金额
  couponAmount?: number;
  // 抹零金额
  roundingAmount?: number;
  // 应付金额
  payableAmount?: number;
  // 实付金额
  paidAmount?: number;
  // 现金支付
  cashAmount?: number;
  // 微信支付
  wechatAmount?: number;
  // 支付宝支付
  alipayAmount?: number;
  // 支付流水号
  paymentSerialNo?: string;
  // 促销描述
  promotionDesc?: string;
  // 小票图片
  imageUrl?: string;
  // OCR原始文本
  ocrText?: string;
  // 结构化解析结果
  parsedData?: string;
  // 校验状态(1通过 0失败)
  verifyStatus?: number;
  // 失败原因
  verifyFailReason?: string;
  // 是否有效
  isValid?: number;
  // 是否符合抽奖
  isLotteryQualified?: number;
  // 关联抽奖记录
  lotteryRecordId?: number;
  // 来源
  source?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export interface ReceiptOrderPageResponse {
  createTime?: Date;
  // 订单ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次关系ID
  terminalCashierId?: number;
  // 小票单号
  receiptNo?: string;
  // 小票时间
  receiptTime?: Date;
  // 支付时间
  paymentTime?: Date;
  // 重打时间
  reprintTime?: Date;
  // 是否重打单
  isReprint?: number;
  // 会员号
  memberNo?: string;
  // 会员手机号
  memberPhone?: string;
  // 会员姓名
  memberName?: string;
  // 本次积分
  pointsEarned?: number;
  // 累计积分
  pointsTotal?: number;
  // 商品种类数
  totalItems?: number;
  // 商品总数量
  totalQuantity?: number;
  // 订单原价
  originalAmount?: number;
  // 优惠金额
  discountAmount?: number;
  // 优惠券金额
  couponAmount?: number;
  // 抹零金额
  roundingAmount?: number;
  // 应付金额
  payableAmount?: number;
  // 实付金额
  paidAmount?: number;
  // 现金支付
  cashAmount?: number;
  // 微信支付
  wechatAmount?: number;
  // 支付宝支付
  alipayAmount?: number;
  // 支付流水号
  paymentSerialNo?: string;
  // 促销描述
  promotionDesc?: string;
  // 小票图片
  imageUrl?: string;
  // OCR原始文本
  ocrText?: string;
  // 结构化解析结果
  parsedData?: string;
  // 校验状态(1通过 0失败)
  verifyStatus?: number;
  // 失败原因
  verifyFailReason?: string;
  // 是否有效
  isValid?: number;
  // 是否符合抽奖
  isLotteryQualified?: number;
  // 关联抽奖记录
  lotteryRecordId?: number;
  // 来源
  source?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export function getReceiptOrderListApi(params: ReceiptOrderListCommand) {
  return http.request<ResponseData<PageDTO<ReceiptOrderPageResponse>>>(
    "get",
    "/buz/receiptOrder/list",
    {
      params
    }
  );
}

export const exportReceiptOrderExcelApi = (
  params: ReceiptOrderListCommand,
  fileName: string
) => {
  return http.download("/buz/receiptOrder/excel", fileName, {
    params
  });
};

export const deleteReceiptOrderApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/receiptOrder", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface ReceiptOrderAddCommand {
  // 订单ID
  id?: number;
  // 顾客ID
  customerId?: number;
  // 门店ID
  storeId?: number;
  // POS终端ID
  terminalId?: number;
  // 收银员ID
  cashierId?: number;
  // 班次关系ID
  terminalCashierId?: number;
  // 小票单号
  receiptNo?: string;
  // 小票时间
  receiptTime?: Date;
  // 支付时间
  paymentTime?: Date;
  // 重打时间
  reprintTime?: Date;
  // 是否重打单
  isReprint?: number;
  // 会员号
  memberNo?: string;
  // 会员手机号
  memberPhone?: string;
  // 会员姓名
  memberName?: string;
  // 本次积分
  pointsEarned?: number;
  // 累计积分
  pointsTotal?: number;
  // 商品种类数
  totalItems?: number;
  // 商品总数量
  totalQuantity?: number;
  // 订单原价
  originalAmount?: number;
  // 优惠金额
  discountAmount?: number;
  // 优惠券金额
  couponAmount?: number;
  // 抹零金额
  roundingAmount?: number;
  // 应付金额
  payableAmount?: number;
  // 实付金额
  paidAmount?: number;
  // 现金支付
  cashAmount?: number;
  // 微信支付
  wechatAmount?: number;
  // 支付宝支付
  alipayAmount?: number;
  // 支付流水号
  paymentSerialNo?: string;
  // 促销描述
  promotionDesc?: string;
  // 小票图片
  imageUrl?: string;
  // OCR原始文本
  ocrText?: string;
  // 结构化解析结果
  parsedData?: string;
  // 校验状态(1通过 0失败)
  verifyStatus?: number;
  // 失败原因
  verifyFailReason?: string;
  // 是否有效
  isValid?: number;
  // 是否符合抽奖
  isLotteryQualified?: number;
  // 关联抽奖记录
  lotteryRecordId?: number;
  // 来源
  source?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
  // 更新时间
  updatedTime?: Date;
}

export const addReceiptOrderApi = (data: ReceiptOrderAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/receiptOrder", {
    data
  });
};

export interface ReceiptOrderUpdateCommand extends ReceiptOrderAddCommand {
  id: number;
}

export const updateReceiptOrderApi = (data: ReceiptOrderUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/receiptOrder", {
    data
  });
};
