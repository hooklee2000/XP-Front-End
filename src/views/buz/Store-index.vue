<script setup lang="ts">
import { ref } from "vue";
import { useStoreHook } from "./utils/Store-hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useUserStoreHook } from "@/store/modules/user";
// TODO 这个导入声明好长  看看如何优化
import { CommonUtils } from "@/utils/common";
import StoreFormModal from "@/views/buz/Store-form-modal.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import { StorePageResponse } from "@/api/buz/Store-client";
import AddFill from "@iconify-icons/ri/add-circle-line";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "Store"
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
  getStoreList,
  handleDelete,
  handleBulkDelete
} = useStoreHook();

const opType = ref<"add" | "update">("add");
const modalVisible = ref(false);
const opRow = ref<StorePageResponse>();
function openDialog(type: "add" | "update", row?: StorePageResponse) {
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
      <el-form-item label="门店ID" prop="id">
        <el-input
          v-model="searchFormParams.id"
          placeholder="请输入门店ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="门店全称" prop="name">
        <el-input
          v-model="searchFormParams.name"
          placeholder="请输入门店全称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="门店简称（滚动展示）" prop="shortName">
        <el-input
          v-model="searchFormParams.shortName"
          placeholder="请输入门店简称（滚动展示）"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="品牌名称" prop="brand">
        <el-input
          v-model="searchFormParams.brand"
          placeholder="请输入品牌名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-input
          v-model="searchFormParams.province"
          placeholder="请输入省"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-input
          v-model="searchFormParams.city"
          placeholder="请输入市"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="区县" prop="county">
        <el-input
          v-model="searchFormParams.county"
          placeholder="请输入区县"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="街道镇乡" prop="street">
        <el-input
          v-model="searchFormParams.street"
          placeholder="请输入街道镇乡"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="searchFormParams.address"
          placeholder="请输入详细地址"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="联系负责人" prop="contactPerson">
        <el-input
          v-model="searchFormParams.contactPerson"
          placeholder="请输入联系负责人"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input
          v-model="searchFormParams.contactPhone"
          placeholder="请输入联系人电话"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="营业执照号" prop="businessLicenseNo">
        <el-input
          v-model="searchFormParams.businessLicenseNo"
          placeholder="请输入营业执照号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="是否启用抽奖" prop="lotteryEnabled">
        <el-input
          v-model="searchFormParams.lotteryEnabled"
          placeholder="请输入是否启用抽奖"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="最低抽奖金额" prop="lotteryMinAmount">
        <el-input
          v-model="searchFormParams.lotteryMinAmount"
          placeholder="请输入最低抽奖金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="每日预算" prop="dailyBudget">
        <el-input
          v-model="searchFormParams.dailyBudget"
          placeholder="请输入每日预算"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="每月预算" prop="monthlyBudget">
        <el-input
          v-model="searchFormParams.monthlyBudget"
          placeholder="请输入每月预算"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="服务费比例" prop="serviceFeeRate">
        <el-input
          v-model="searchFormParams.serviceFeeRate"
          placeholder="请输入服务费比例"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="目标增长营业额" prop="targetGrowthAmount">
        <el-input
          v-model="searchFormParams.targetGrowthAmount"
          placeholder="请输入目标增长营业额"
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
    <PureTableBar title="门店表列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('add')"
        >
          新增门店表
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
          @click="CommonUtils.exportExcel(columns, dataList, '门店表列表')"
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
          @page-size-change="getStoreList"
          @page-current-change="getStoreList"
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
              :title="`是否确认删除编号为${row.menuId}的这个门店表`"
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

    <Store-form-modal
      v-model="modalVisible"
      :type="opType"
      :row="opRow"
      @success="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
