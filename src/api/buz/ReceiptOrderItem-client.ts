import { http } from "@/utils/http";

export interface ReceiptOrderItemListCommand extends BasePageQuery {
  // 商品明细ID
  id?: number;
  // 订单ID
  receiptOrderId?: number;
  // 条码
  barcode?: string;
  // OCR原始商品名
  rawName?: string;
  // 标准商品ID
  productId?: number;
  // 分类
  category?: string;
  // 单位
  unit?: string;
  // 是否称重商品
  isWeighted?: number;
  // 数量
  quantity?: number;
  // 原价
  originalPrice?: number;
  // 执行价
  salePrice?: number;
  // 行金额
  totalAmount?: number;
  // OCR原始行
  rawLine?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export interface ReceiptOrderItemPageResponse {
  createTime?: Date;
  // 商品明细ID
  id?: number;
  // 订单ID
  receiptOrderId?: number;
  // 条码
  barcode?: string;
  // OCR原始商品名
  rawName?: string;
  // 标准商品ID
  productId?: number;
  // 分类
  category?: string;
  // 单位
  unit?: string;
  // 是否称重商品
  isWeighted?: number;
  // 数量
  quantity?: number;
  // 原价
  originalPrice?: number;
  // 执行价
  salePrice?: number;
  // 行金额
  totalAmount?: number;
  // OCR原始行
  rawLine?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export function getReceiptOrderItemListApi(params: ReceiptOrderItemListCommand) {
  return http.request<ResponseData<PageDTO<ReceiptOrderItemPageResponse>>>(
    "get",
    "/buz/receiptOrderItem/list",
    {
      params
    }
  );
}

export const exportReceiptOrderItemExcelApi = (
  params: ReceiptOrderItemListCommand,
  fileName: string
) => {
  return http.download("/buz/receiptOrderItem/excel", fileName, {
    params
  });
};

export const deleteReceiptOrderItemApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/buz/receiptOrderItem", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      ids: data.toString()
    }
  });
};

export interface ReceiptOrderItemAddCommand {
  // 商品明细ID
  id?: number;
  // 订单ID
  receiptOrderId?: number;
  // 条码
  barcode?: string;
  // OCR原始商品名
  rawName?: string;
  // 标准商品ID
  productId?: number;
  // 分类
  category?: string;
  // 单位
  unit?: string;
  // 是否称重商品
  isWeighted?: number;
  // 数量
  quantity?: number;
  // 原价
  originalPrice?: number;
  // 执行价
  salePrice?: number;
  // 行金额
  totalAmount?: number;
  // OCR原始行
  rawLine?: string;
  // 状态(1启用 0停用)
  status?: number;
  // 创建时间
  createdTime?: Date;
}

export const addReceiptOrderItemApi = (data: ReceiptOrderItemAddCommand) => {
  return http.request<ResponseData<void>>("post", "/buz/receiptOrderItem", {
    data
  });
};

export interface ReceiptOrderItemUpdateCommand extends ReceiptOrderItemAddCommand {
  id: number;
}

export const updateReceiptOrderItemApi = (data: ReceiptOrderItemUpdateCommand) => {
  return http.request<ResponseData<void>>("put", "/buz/receiptOrderItem", {
    data
  });
};
