<script setup lang="ts">
import { ref } from "vue";
import { useCashierHook } from "./utils/Cashier-hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useUserStoreHook } from "@/store/modules/user";
// TODO 这个导入声明好长  看看如何优化
import { CommonUtils } from "@/utils/common";
import CashierFormModal from "@/views/buz/Cashier-form-modal.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import { CashierPageResponse } from "@/api/buz/Cashier-client";
import AddFill from "@iconify-icons/ri/add-circle-line";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "Cashier"
});

const loginLogStatusList = useUserStoreHook().dictionaryList["common.status"];

const tableRef = ref();

const searchFormRef = ref();
const {
  searchFormParams,
  pageLoading,
  columns,
  dataList,
  pagination,
  timeRange,
  defaultSort,
  multipleSelection,
  onSearch,
  resetForm,
  onSortChanged,
  exportAllExcel,
  getCashierList,
  handleDelete,
  handleBulkDelete
} = useCashierHook();

const opType = ref<"add" | "update">("add");
const modalVisible = ref(false);
const opRow = ref<CashierPageResponse>();
function openDialog(type: "add" | "update", row?: CashierPageResponse) {
  opType.value = type;
  opRow.value = row;
  modalVisible.value = true;
}
</script>

<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="收银员ID" prop="id">
        <el-input
          v-model="searchFormParams.id"
          placeholder="请输入收银员ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="所属门店" prop="storeId">
        <el-input
          v-model="searchFormParams.storeId"
          placeholder="请输入所属门店"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="收银员工号" prop="cashierCode">
        <el-input
          v-model="searchFormParams.cashierCode"
          placeholder="请输入收银员工号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="searchFormParams.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="searchFormParams.phone"
          placeholder="请输入手机号码"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态(1启用 0停用)" prop="status">
        <el-input
          v-model="searchFormParams.status"
          placeholder="请输入状态(1启用 0停用)"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchFormParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="dict in loginLogStatusList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          class="!w-[240px]"
          v-model="timeRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="pageLoading"
          @click="onSearch(tableRef)"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetForm(searchFormRef, tableRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- table bar 包裹  table -->
    <PureTableBar title="收银员表列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('add')"
        >
          新增收银员表
        </el-button>
        <el-button
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="handleBulkDelete(tableRef)"
        >
          批量删除
        </el-button>
        <el-button
          type="primary"
          @click="CommonUtils.exportExcel(columns, dataList, '收银员表列表')"
        >
          单页导出
        </el-button>
        <el-button type="primary" @click="exportAllExcel">全部导出</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="pageLoading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :default-sort="defaultSort"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="getCashierList"
          @page-current-change="getCashierList"
          @sort-change="onSortChanged"
          @selection-change="
            rows => (multipleSelection = rows.map(item => item.id))
          "
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('update', row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`是否确认删除编号为${row.menuId}的这个收银员表`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <Cashier-form-modal
      v-model="modalVisible"
      :type="opType"
      :row="opRow"
      @success="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: undefined;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
