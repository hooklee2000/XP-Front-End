import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, toRaw, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { CommonUtils } from "@/utils/common";
import { PaginationProps } from "@pureadmin/table";
import {
  StoreListCommand,
  getStoreListApi,
  exportStoreExcelApi,
  deleteStoreApi
} from "@/api/buz/Store-client";

const statusMap = useUserStoreHook().dictionaryMap["common.status"];

export function useStoreHook() {
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

  const searchFormParams = reactive<StoreListCommand>({
    // 门店ID
    id: undefined,
    // 门店全称
    name: undefined,
    // 门店简称（滚动展示）
    shortName: undefined,
    // 品牌名称
    brand: undefined,
    // 省
    province: undefined,
    // 市
    city: undefined,
    // 区县
    county: undefined,
    // 街道镇乡
    street: undefined,
    // 详细地址
    address: undefined,
    // 联系负责人
    contactPerson: undefined,
    // 联系人电话
    contactPhone: undefined,
    // 营业执照号
    businessLicenseNo: undefined,
    // 是否启用抽奖
    lotteryEnabled: undefined,
    // 最低抽奖金额
    lotteryMinAmount: undefined,
    // 每日预算
    dailyBudget: undefined,
    // 每月预算
    monthlyBudget: undefined,
    // 服务费比例
    serviceFeeRate: undefined,
    // 目标增长营业额
    targetGrowthAmount: undefined,
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
      label: "门店ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "门店全称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "门店简称（滚动展示）",
      prop: "shortName",
      minWidth: 100
    },
    {
      label: "品牌名称",
      prop: "brand",
      minWidth: 100
    },
    {
      label: "省",
      prop: "province",
      minWidth: 100
    },
    {
      label: "市",
      prop: "city",
      minWidth: 100
    },
    {
      label: "区县",
      prop: "county",
      minWidth: 100
    },
    {
      label: "街道镇乡",
      prop: "street",
      minWidth: 100
    },
    {
      label: "详细地址",
      prop: "address",
      minWidth: 100
    },
    {
      label: "联系负责人",
      prop: "contactPerson",
      minWidth: 100
    },
    {
      label: "联系人电话",
      prop: "contactPhone",
      minWidth: 100
    },
    {
      label: "营业执照号",
      prop: "businessLicenseNo",
      minWidth: 100
    },
    {
      label: "是否启用抽奖",
      prop: "lotteryEnabled",
      minWidth: 100
    },
    {
      label: "最低抽奖金额",
      prop: "lotteryMinAmount",
      minWidth: 100
    },
    {
      label: "每日预算",
      prop: "dailyBudget",
      minWidth: 100
    },
    {
      label: "每月预算",
      prop: "monthlyBudget",
      minWidth: 100
    },
    {
      label: "服务费比例",
      prop: "serviceFeeRate",
      minWidth: 100
    },
    {
      label: "目标增长营业额",
      prop: "targetGrowthAmount",
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
    getStoreList();
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

  async function getStoreList() {
    pageLoading.value = true;
    CommonUtils.fillSortParams(searchFormParams, sortState.value);
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    const { data } = await getStoreListApi(toRaw(searchFormParams)).finally(
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

    exportStoreExcelApi(toRaw(searchFormParams), "门店表数据.xlsx");
  }
  async function handleDelete(row) {
    await deleteStoreApi([row.id]).then(() => {
      message("`您删除了编号为${row.id}的这条门店表数据``", {
        type: "success"
      });
      // 刷新列表
      getStoreList();
    });
  }

  async function handleBulkDelete(tableRef) {
    if (multipleSelection.value.length === 0) {
      message("请选择需要删除的数据", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      "`确认要<strong>删除</strong>编号为<strong style='color:var(--el-color-primary)'>[ ${multipleSelection.value} ]</strong>的门店表数据吗?`",
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
        await deleteStoreApi(multipleSelection.value).then(() => {
          message(
            "`您删除了编号为[ ${multipleSelection.value} ]的门店表数据`",
            {
              type: "success"
            }
          );
          // 刷新列表
          getStoreList();
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

  onMounted(getStoreList);

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
    getStoreList,
    resetForm,
    handleDelete,
    handleBulkDelete
  };
}
