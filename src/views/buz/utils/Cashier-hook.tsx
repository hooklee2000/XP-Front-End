import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, toRaw, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { CommonUtils } from "@/utils/common";
import { PaginationProps } from "@pureadmin/table";
import {
  CashierListCommand,
  getCashierListApi,
  exportCashierExcelApi,
  deleteCashierApi
} from "@/api/buz/Cashier-client";

const statusMap = useUserStoreHook().dictionaryMap["common.status"];

export function useCashierHook() {
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

  const searchFormParams = reactive<CashierListCommand>({
    // 收银员ID
    id: undefined,
    // 所属门店
    storeId: undefined,
    // 收银员工号
    cashierCode: undefined,
    // 姓名
    name: undefined,
    // 手机号码
    phone: undefined,
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
      label: "收银员ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "所属门店",
      prop: "storeId",
      minWidth: 100
    },
    {
      label: "收银员工号",
      prop: "cashierCode",
      minWidth: 100
    },
    {
      label: "姓名",
      prop: "name",
      minWidth: 100
    },
    {
      label: "手机号码",
      prop: "phone",
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
    getCashierList();
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

  async function getCashierList() {
    pageLoading.value = true;
    CommonUtils.fillSortParams(searchFormParams, sortState.value);
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    const { data } = await getCashierListApi(toRaw(searchFormParams)).finally(
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

    exportCashierExcelApi(toRaw(searchFormParams), "收银员表数据.xlsx");
  }
  async function handleDelete(row) {
    await deleteCashierApi([row.id]).then(() => {
      message("`您删除了编号为${row.id}的这条收银员表数据``", {
        type: "success"
      });
      // 刷新列表
      getCashierList();
    });
  }

  async function handleBulkDelete(tableRef) {
    if (multipleSelection.value.length === 0) {
      message("请选择需要删除的数据", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      "`确认要<strong>删除</strong>编号为<strong style='color:var(--el-color-primary)'>[ ${multipleSelection.value} ]</strong>的收银员表数据吗?`",
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
        await deleteCashierApi(multipleSelection.value).then(() => {
          message(
            "`您删除了编号为[ ${multipleSelection.value} ]的收银员表数据`",
            {
              type: "success"
            }
          );
          // 刷新列表
          getCashierList();
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

  onMounted(getCashierList);

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
    getCashierList,
    resetForm,
    handleDelete,
    handleBulkDelete
  };
}
