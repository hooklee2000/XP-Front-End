<script setup lang="ts">
import { ref } from "vue";
import { useCustomerHook } from "./utils/Customer-hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useUserStoreHook } from "@/store/modules/user";
// TODO 这个导入声明好长  看看如何优化
import { CommonUtils } from "@/utils/common";
import CustomerFormModal from "@/views/buz/Customer-form-modal.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import { CustomerPageResponse } from "@/api/buz/Customer-client";
import AddFill from "@iconify-icons/ri/add-circle-line";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "Customer"
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
  getCustomerList,
  handleDelete,
  handleBulkDelete
} = useCustomerHook();

const opType = ref<"add" | "update">("add");
const modalVisible = ref(false);
const opRow = ref<CustomerPageResponse>();
function openDialog(type: "add" | "update", row?: CustomerPageResponse) {
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
      <el-form-item label="顾客ID" prop="id">
        <el-input
          v-model="searchFormParams.id"
          placeholder="请输入顾客ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="微信openid" prop="openid">
        <el-input
          v-model="searchFormParams.openid"
          placeholder="请输入微信openid"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="微信unionid" prop="unionid">
        <el-input
          v-model="searchFormParams.unionid"
          placeholder="请输入微信unionid"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="微信昵称" prop="nickname">
        <el-input
          v-model="searchFormParams.nickname"
          placeholder="请输入微信昵称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="searchFormParams.phone"
          placeholder="请输入手机号"
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
      <el-form-item label="县" prop="county">
        <el-input
          v-model="searchFormParams.county"
          placeholder="请输入县"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="头像地址" prop="avatarUrl">
        <el-input
          v-model="searchFormParams.avatarUrl"
          placeholder="请输入头像地址"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="累计中奖金额" prop="totalWinningAmount">
        <el-input
          v-model="searchFormParams.totalWinningAmount"
          placeholder="请输入累计中奖金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="累计提现金额" prop="totalWithdrawAmount">
        <el-input
          v-model="searchFormParams.totalWithdrawAmount"
          placeholder="请输入累计提现金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="今日到账金额（风控）" prop="todayReceiveAmount">
        <el-input
          v-model="searchFormParams.todayReceiveAmount"
          placeholder="请输入今日到账金额（风控）"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-input
          v-model="searchFormParams.riskLevel"
          placeholder="请输入风险等级"
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
      <el-form-item label="是否同意顾客使用协议" prop="agreedUserProtocol">
        <el-input
          v-model="searchFormParams.agreedUserProtocol"
          placeholder="请输入是否同意顾客使用协议"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="协议确认时间" prop="agreedProtocolTime">
        <el-input
          v-model="searchFormParams.agreedProtocolTime"
          placeholder="请输入协议确认时间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="最后登录IP" prop="lastLoginIp">
        <el-input
          v-model="searchFormParams.lastLoginIp"
          placeholder="请输入最后登录IP"
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
    <PureTableBar title="顾客表列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('add')"
        >
          新增顾客表
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
          @click="CommonUtils.exportExcel(columns, dataList, '顾客表列表')"
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
          @page-size-change="getCustomerList"
          @page-current-change="getCustomerList"
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
              :title="`是否确认删除编号为${row.menuId}的这个顾客表`"
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

    <Customer-form-modal
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
