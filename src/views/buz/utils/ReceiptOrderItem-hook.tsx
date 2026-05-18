import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, toRaw, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { CommonUtils } from "@/utils/common";
import { PaginationProps } from "@pureadmin/table";
import {
  ReceiptOrderItemListCommand,
  getReceiptOrderItemListApi,
  exportReceiptOrderItemExcelApi,
  deleteReceiptOrderItemApi
} from "@/api/buz/ReceiptOrderItem-client";

const statusMap = useUserStoreHook().dictionaryMap["common.status"];

export function useReceiptOrderItemHook() {
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

  const searchFormParams = reactive<ReceiptOrderItemListCommand>({
    // 商品明细ID
    id: undefined,
    // 订单ID
    receiptOrderId: undefined,
    // 条码
    barcode: undefined,
    // OCR原始商品名
    rawName: undefined,
    // 标准商品ID
    productId: undefined,
    // 分类
    category: undefined,
    // 单位
    unit: undefined,
    // 是否称重商品
    isWeighted: undefined,
    // 数量
    quantity: undefined,
    // 原价
    originalPrice: undefined,
    // 执行价
    salePrice: undefined,
    // 行金额
    totalAmount: undefined,
    // OCR原始行
    rawLine: undefined,
    // 状态(1启用 0停用)
    status: undefined,
    createTime: undefined
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
      label: "商品明细ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "订单ID",
      prop: "receiptOrderId",
      minWidth: 100
    },
    {
      label: "条码",
      prop: "barcode",
      minWidth: 100
    },
    {
      label: "OCR原始商品名",
      prop: "rawName",
      minWidth: 100
    },
    {
      label: "标准商品ID",
      prop: "productId",
      minWidth: 100
    },
    {
      label: "分类",
      prop: "category",
      minWidth: 100
    },
    {
      label: "单位",
      prop: "unit",
      minWidth: 100
    },
    {
      label: "是否称重商品",
      prop: "isWeighted",
      minWidth: 100
    },
    {
      label: "数量",
      prop: "quantity",
      minWidth: 100
    },
    {
      label: "原价",
      prop: "originalPrice",
      minWidth: 100
    },
    {
      label: "执行价",
      prop: "salePrice",
      minWidth: 100
    },
    {
      label: "行金额",
      prop: "totalAmount",
      minWidth: 100
    },
    {
      label: "OCR原始行",
      prop: "rawLine",
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
    getReceiptOrderItemList();
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

  async function getReceiptOrderItemList() {
    pageLoading.value = true;
    CommonUtils.fillSortParams(searchFormParams, sortState.value);
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    const { data } = await getReceiptOrderItemListApi(toRaw(searchFormParams)).finally(
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

    exportReceiptOrderItemExcelApi(toRaw(searchFormParams), "小票商品表数据.xlsx");
  }
  async function handleDelete(row) {
    await deleteReceiptOrderItemApi([row.id]).then(() => {
      message("`您删除了编号为${row.id}的这条小票商品表数据``", {
        type: "success"
      });
      // 刷新列表
      getReceiptOrderItemList();
    });
  }

  async function handleBulkDelete(tableRef) {
    if (multipleSelection.value.length === 0) {
      message("请选择需要删除的数据", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      "`确认要<strong>删除</strong>编号为<strong style='color:var(--el-color-primary)'>[ ${multipleSelection.value} ]</strong>的小票商品表数据吗?`",
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
        await deleteReceiptOrderItemApi(multipleSelection.value).then(() => {
          message(
            "`您删除了编号为[ ${multipleSelection.value} ]的小票商品表数据`",
            {
              type: "success"
            }
          );
          // 刷新列表
          getReceiptOrderItemList();
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

  onMounted(getReceiptOrderItemList);

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
    getReceiptOrderItemList,
    resetForm,
    handleDelete,
    handleBulkDelete
  };
}
