import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, toRaw, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { CommonUtils } from "@/utils/common";
import { PaginationProps } from "@pureadmin/table";
import {
  ReceiptOrderListCommand,
  getReceiptOrderListApi,
  exportReceiptOrderExcelApi,
  deleteReceiptOrderApi
} from "@/api/buz/ReceiptOrder-client";

const statusMap = useUserStoreHook().dictionaryMap["common.status"];

export function useReceiptOrderHook() {
  const defaultSort: Sort = {
    prop: "createTime",
    order: "ascending"
  };

  const pagination: PaginationProps = {
    total: undefined,
    pageSize: 10,
    currentPage: 1,
    background: true
  };

  const timeRange = computed<[string, string] | null>({
    get() {
      if (searchFormParams.beginTime && searchFormParams.endTime) {
        return [searchFormParams.beginTime, searchFormParams.endTime];
      } else {
        return null;
      }
    },
    set(v) {
      if (v?.length === 2) {
        searchFormParams.beginTime = v[0];
        searchFormParams.endTime = v[1];
      } else {
        searchFormParams.beginTime = undefined;
        searchFormParams.endTime = undefined;
      }
    }
  });

  const searchFormParams = reactive<ReceiptOrderListCommand>({
    // 订单ID
    id: undefined,
    // 顾客ID
    customerId: undefined,
    // 门店ID
    storeId: undefined,
    // POS终端ID
    terminalId: undefined,
    // 收银员ID
    cashierId: undefined,
    // 班次关系ID
    terminalCashierId: undefined,
    // 小票单号
    receiptNo: undefined,
    // 小票时间
    receiptTime: undefined,
    // 支付时间
    paymentTime: undefined,
    // 重打时间
    reprintTime: undefined,
    // 是否重打单
    isReprint: undefined,
    // 会员号
    memberNo: undefined,
    // 会员手机号
    memberPhone: undefined,
    // 会员姓名
    memberName: undefined,
    // 本次积分
    pointsEarned: undefined,
    // 累计积分
    pointsTotal: undefined,
    // 商品种类数
    totalItems: undefined,
    // 商品总数量
    totalQuantity: undefined,
    // 订单原价
    originalAmount: undefined,
    // 优惠金额
    discountAmount: undefined,
    // 优惠券金额
    couponAmount: undefined,
    // 抹零金额
    roundingAmount: undefined,
    // 应付金额
    payableAmount: undefined,
    // 实付金额
    paidAmount: undefined,
    // 现金支付
    cashAmount: undefined,
    // 微信支付
    wechatAmount: undefined,
    // 支付宝支付
    alipayAmount: undefined,
    // 支付流水号
    paymentSerialNo: undefined,
    // 促销描述
    promotionDesc: undefined,
    // 小票图片
    imageUrl: undefined,
    // OCR原始文本
    ocrText: undefined,
    // 结构化解析结果
    parsedData: undefined,
    // 校验状态(1通过 0失败)
    verifyStatus: undefined,
    // 失败原因
    verifyFailReason: undefined,
    // 是否有效
    isValid: undefined,
    // 是否符合抽奖
    isLotteryQualified: undefined,
    // 关联抽奖记录
    lotteryRecordId: undefined,
    // 来源
    source: undefined,
    // 状态(1启用 0停用)
    status: undefined,
  });

  const dataList = ref([]);
  const pageLoading = ref(true);
  const multipleSelection = ref([]);
  const sortState = ref<Sort>(defaultSort);

  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left"
    },

    {
      label: "订单ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "顾客ID",
      prop: "customerId",
      minWidth: 100
    },
    {
      label: "门店ID",
      prop: "storeId",
      minWidth: 100
    },
    {
      label: "POS终端ID",
      prop: "terminalId",
      minWidth: 100
    },
    {
      label: "收银员ID",
      prop: "cashierId",
      minWidth: 100
    },
    {
      label: "班次关系ID",
      prop: "terminalCashierId",
      minWidth: 100
    },
    {
      label: "小票单号",
      prop: "receiptNo",
      minWidth: 100
    },
    {
      label: "小票时间",
      prop: "receiptTime",
      minWidth: 100
    },
    {
      label: "支付时间",
      prop: "paymentTime",
      minWidth: 100
    },
    {
      label: "重打时间",
      prop: "reprintTime",
      minWidth: 100
    },
    {
      label: "是否重打单",
      prop: "isReprint",
      minWidth: 100
    },
    {
      label: "会员号",
      prop: "memberNo",
      minWidth: 100
    },
    {
      label: "会员手机号",
      prop: "memberPhone",
      minWidth: 100
    },
    {
      label: "会员姓名",
      prop: "memberName",
      minWidth: 100
    },
    {
      label: "本次积分",
      prop: "pointsEarned",
      minWidth: 100
    },
    {
      label: "累计积分",
      prop: "pointsTotal",
      minWidth: 100
    },
    {
      label: "商品种类数",
      prop: "totalItems",
      minWidth: 100
    },
    {
      label: "商品总数量",
      prop: "totalQuantity",
      minWidth: 100
    },
    {
      label: "订单原价",
      prop: "originalAmount",
      minWidth: 100
    },
    {
      label: "优惠金额",
      prop: "discountAmount",
      minWidth: 100
    },
    {
      label: "优惠券金额",
      prop: "couponAmount",
      minWidth: 100
    },
    {
      label: "抹零金额",
      prop: "roundingAmount",
      minWidth: 100
    },
    {
      label: "应付金额",
      prop: "payableAmount",
      minWidth: 100
    },
    {
      label: "实付金额",
      prop: "paidAmount",
      minWidth: 100
    },
    {
      label: "现金支付",
      prop: "cashAmount",
      minWidth: 100
    },
    {
      label: "微信支付",
      prop: "wechatAmount",
      minWidth: 100
    },
    {
      label: "支付宝支付",
      prop: "alipayAmount",
      minWidth: 100
    },
    {
      label: "支付流水号",
      prop: "paymentSerialNo",
      minWidth: 100
    },
    {
      label: "促销描述",
      prop: "promotionDesc",
      minWidth: 100
    },
    {
      label: "小票图片",
      prop: "imageUrl",
      minWidth: 100
    },
    {
      label: "OCR原始文本",
      prop: "ocrText",
      minWidth: 100
    },
    {
      label: "结构化解析结果",
      prop: "parsedData",
      minWidth: 100
    },
    {
      label: "校验状态(1通过 0失败)",
      prop: "verifyStatus",
      minWidth: 100
    },
    {
      label: "失败原因",
      prop: "verifyFailReason",
      minWidth: 100
    },
    {
      label: "是否有效",
      prop: "isValid",
      minWidth: 100
    },
    {
      label: "是否符合抽奖",
      prop: "isLotteryQualified",
      minWidth: 100
    },
    {
      label: "关联抽奖记录",
      prop: "lotteryRecordId",
      minWidth: 100
    },
    {
      label: "来源",
      prop: "source",
      minWidth: 100
    },
    {
      label: "状态(1启用 0停用)",
      prop: "status",
      minWidth: 100
    },

    {
      label: "状态",
      prop: "status",
      minWidth: 120,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={statusMap[row.status].cssTag}
          effect="plain"
        >
          {statusMap[row.status].label}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 160,
      prop: "createTime",
      sortable: "custom",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  function onSortChanged(sort: Sort) {
    sortState.value = sort;
    // 表格列的排序变化的时候，需要重置分页
    pagination.currentPage = 1;
    getReceiptOrderList();
  }

  async function onSearch(tableRef) {
    // 点击搜索的时候，需要重置排序，重新排序的时候会重置分页并发起查询请求
    tableRef.getTableRef().sort("createTime", "ascending");
  }

  function resetForm(formEl, tableRef) {
    if (!formEl) return;
    // 清空查询参数
    formEl.resetFields();
    // 清空时间查询  TODO  这块有点繁琐  有可以优化的地方吗？
    // Form组件的resetFields方法无法清除datepicker里面的数据。
    searchFormParams.beginTime = undefined;
    searchFormParams.endTime = undefined;
    // 重置分页并查询
    onSearch(tableRef);
  }

  async function getReceiptOrderList() {
    pageLoading.value = true;
    CommonUtils.fillSortParams(searchFormParams, sortState.value);
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    const { data } = await getReceiptOrderListApi(toRaw(searchFormParams)).finally(
      () => {
        pageLoading.value = false;
      }
    );
    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function exportAllExcel() {
    if (sortState.value != null) {
      CommonUtils.fillSortParams(searchFormParams, sortState.value);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);
    CommonUtils.fillTimeRangeParams(searchFormParams, timeRange.value);

    exportReceiptOrderExcelApi(toRaw(searchFormParams), "小票订单表（系统核心交易表）数据.xlsx");
  }
  async function handleDelete(row) {
    await deleteReceiptOrderApi([row.id]).then(() => {
      message("`您删除了编号为${row.id}的这条小票订单表（系统核心交易表）数据``", {
        type: "success"
      });
      // 刷新列表
      getReceiptOrderList();
    });
  }

  async function handleBulkDelete(tableRef) {
    if (multipleSelection.value.length === 0) {
      message("请选择需要删除的数据", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      "`确认要<strong>删除</strong>编号为<strong style='color:var(--el-color-primary)'>[ ${multipleSelection.value} ]</strong>的小票订单表（系统核心交易表）数据吗?`",
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        await deleteReceiptOrderApi(multipleSelection.value).then(() => {
          message(
            "`您删除了编号为[ ${multipleSelection.value} ]的小票订单表（系统核心交易表）数据`",
            {
              type: "success"
            }
          );
          // 刷新列表
          getReceiptOrderList();
        });
      })
      .catch(() => {
        message("取消删除", {
          type: "info"
        });
        // 清空checkbox选择的数据
        tableRef.getTableRef().clearSelection();
      });
  }

  onMounted(getReceiptOrderList);

  return {
    searchFormParams,
    pageLoading,
    columns,
    dataList,
    pagination,
    defaultSort,
    timeRange,
    multipleSelection,
    onSearch,
    onSortChanged,
    exportAllExcel,
    // exportExcel,
    getReceiptOrderList,
    resetForm,
    handleDelete,
    handleBulkDelete
  };
}
