<script setup lang="ts">
import { ref } from "vue";
import { useLotteryConfigHook } from "./utils/LotteryConfig-hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useUserStoreHook } from "@/store/modules/user";
// TODO 这个导入声明好长  看看如何优化
import { CommonUtils } from "@/utils/common";
import LotteryConfigFormModal from "@/views/buz/LotteryConfig-form-modal.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import { LotteryConfigPageResponse } from "@/api/buz/LotteryConfig-client";
import AddFill from "@iconify-icons/ri/add-circle-line";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "LotteryConfig"
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
  getLotteryConfigList,
  handleDelete,
  handleBulkDelete
} = useLotteryConfigHook();

const opType = ref<"add" | "update">("add");
const modalVisible = ref(false);
const opRow = ref<LotteryConfigPageResponse>();
function openDialog(type: "add" | "update", row?: LotteryConfigPageResponse) {
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
      <el-form-item label="配置ID" prop="id">
        <el-input
          v-model="searchFormParams.id"
          placeholder="请输入配置ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="门店ID" prop="storeId">
        <el-input
          v-model="searchFormParams.storeId"
          placeholder="请输入门店ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="奖项名称" prop="prizeName">
        <el-input
          v-model="searchFormParams.prizeName"
          placeholder="请输入奖项名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="中奖金额" prop="prizeAmount">
        <el-input
          v-model="searchFormParams.prizeAmount"
          placeholder="请输入中奖金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="中奖概率" prop="probability">
        <el-input
          v-model="searchFormParams.probability"
          placeholder="请输入中奖概率"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="每日限制" prop="dailyLimit">
        <el-input
          v-model="searchFormParams.dailyLimit"
          placeholder="请输入每日限制"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="每周限制" prop="weeklyLimit">
        <el-input
          v-model="searchFormParams.weeklyLimit"
          placeholder="请输入每周限制"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="每月限制" prop="monthlyLimit">
        <el-input
          v-model="searchFormParams.monthlyLimit"
          placeholder="请输入每月限制"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="是否大奖" prop="isSpecialPrize">
        <el-input
          v-model="searchFormParams.isSpecialPrize"
          placeholder="请输入是否大奖"
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
	  
	    
	  
      <el-form-item label="生效日期">
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
    <PureTableBar title="抽奖配置表列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('add')"
        >
          新增抽奖配置表
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
          @click="CommonUtils.exportExcel(columns, dataList, '抽奖配置表列表')"
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
          @page-size-change="getLotteryConfigList"
          @page-current-change="getLotteryConfigList"
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
              :title="`是否确认删除编号为${row.menuId}的这个抽奖配置表`"
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

    <LotteryConfig-form-modal
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
