<script setup lang="ts">
import { ref } from "vue";
import { useReceiptOrderHook } from "./utils/ReceiptOrder-hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useUserStoreHook } from "@/store/modules/user";
// TODO 这个导入声明好长  看看如何优化
import { CommonUtils } from "@/utils/common";
import ReceiptOrderFormModal from "@/views/buz/ReceiptOrder-form-modal.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import { ReceiptOrderPageResponse } from "@/api/buz/ReceiptOrder-client";
import AddFill from "@iconify-icons/ri/add-circle-line";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "ReceiptOrder"
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
  getReceiptOrderList,
  handleDelete,
  handleBulkDelete
} = useReceiptOrderHook();

const opType = ref<"add" | "update">("add");
const modalVisible = ref(false);
const opRow = ref<ReceiptOrderPageResponse>();
function openDialog(type: "add" | "update", row?: ReceiptOrderPageResponse) {
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
      <el-form-item label="订单ID" prop="id">
        <el-input
          v-model="searchFormParams.id"
          placeholder="请输入订单ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="顾客ID" prop="customerId">
        <el-input
          v-model="searchFormParams.customerId"
          placeholder="请输入顾客ID"
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
      <el-form-item label="POS终端ID" prop="terminalId">
        <el-input
          v-model="searchFormParams.terminalId"
          placeholder="请输入POS终端ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="收银员ID" prop="cashierId">
        <el-input
          v-model="searchFormParams.cashierId"
          placeholder="请输入收银员ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="班次关系ID" prop="terminalCashierId">
        <el-input
          v-model="searchFormParams.terminalCashierId"
          placeholder="请输入班次关系ID"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="小票单号" prop="receiptNo">
        <el-input
          v-model="searchFormParams.receiptNo"
          placeholder="请输入小票单号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="小票时间" prop="receiptTime">
        <el-input
          v-model="searchFormParams.receiptTime"
          placeholder="请输入小票时间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="支付时间" prop="paymentTime">
        <el-input
          v-model="searchFormParams.paymentTime"
          placeholder="请输入支付时间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="重打时间" prop="reprintTime">
        <el-input
          v-model="searchFormParams.reprintTime"
          placeholder="请输入重打时间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="是否重打单" prop="isReprint">
        <el-input
          v-model="searchFormParams.isReprint"
          placeholder="请输入是否重打单"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="会员号" prop="memberNo">
        <el-input
          v-model="searchFormParams.memberNo"
          placeholder="请输入会员号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="会员手机号" prop="memberPhone">
        <el-input
          v-model="searchFormParams.memberPhone"
          placeholder="请输入会员手机号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="会员姓名" prop="memberName">
        <el-input
          v-model="searchFormParams.memberName"
          placeholder="请输入会员姓名"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="本次积分" prop="pointsEarned">
        <el-input
          v-model="searchFormParams.pointsEarned"
          placeholder="请输入本次积分"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="累计积分" prop="pointsTotal">
        <el-input
          v-model="searchFormParams.pointsTotal"
          placeholder="请输入累计积分"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="商品种类数" prop="totalItems">
        <el-input
          v-model="searchFormParams.totalItems"
          placeholder="请输入商品种类数"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="商品总数量" prop="totalQuantity">
        <el-input
          v-model="searchFormParams.totalQuantity"
          placeholder="请输入商品总数量"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="订单原价" prop="originalAmount">
        <el-input
          v-model="searchFormParams.originalAmount"
          placeholder="请输入订单原价"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="优惠金额" prop="discountAmount">
        <el-input
          v-model="searchFormParams.discountAmount"
          placeholder="请输入优惠金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="优惠券金额" prop="couponAmount">
        <el-input
          v-model="searchFormParams.couponAmount"
          placeholder="请输入优惠券金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="抹零金额" prop="roundingAmount">
        <el-input
          v-model="searchFormParams.roundingAmount"
          placeholder="请输入抹零金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="应付金额" prop="payableAmount">
        <el-input
          v-model="searchFormParams.payableAmount"
          placeholder="请输入应付金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="实付金额" prop="paidAmount">
        <el-input
          v-model="searchFormParams.paidAmount"
          placeholder="请输入实付金额"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="现金支付" prop="cashAmount">
        <el-input
          v-model="searchFormParams.cashAmount"
          placeholder="请输入现金支付"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="微信支付" prop="wechatAmount">
        <el-input
          v-model="searchFormParams.wechatAmount"
          placeholder="请输入微信支付"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="支付宝支付" prop="alipayAmount">
        <el-input
          v-model="searchFormParams.alipayAmount"
          placeholder="请输入支付宝支付"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="支付流水号" prop="paymentSerialNo">
        <el-input
          v-model="searchFormParams.paymentSerialNo"
          placeholder="请输入支付流水号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="促销描述" prop="promotionDesc">
        <el-input
          v-model="searchFormParams.promotionDesc"
          placeholder="请输入促销描述"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="小票图片" prop="imageUrl">
        <el-input
          v-model="searchFormParams.imageUrl"
          placeholder="请输入小票图片"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="OCR原始文本" prop="ocrText">
        <el-input
          v-model="searchFormParams.ocrText"
          placeholder="请输入OCR原始文本"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="结构化解析结果" prop="parsedData">
        <el-input
          v-model="searchFormParams.parsedData"
          placeholder="请输入结构化解析结果"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="校验状态(1通过 0失败)" prop="verifyStatus">
        <el-input
          v-model="searchFormParams.verifyStatus"
          placeholder="请输入校验状态(1通过 0失败)"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="失败原因" prop="verifyFailReason">
        <el-input
          v-model="searchFormParams.verifyFailReason"
          placeholder="请输入失败原因"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="是否有效" prop="isValid">
        <el-input
          v-model="searchFormParams.isValid"
          placeholder="请输入是否有效"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="是否符合抽奖" prop="isLotteryQualified">
        <el-input
          v-model="searchFormParams.isLotteryQualified"
          placeholder="请输入是否符合抽奖"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="关联抽奖记录" prop="lotteryRecordId">
        <el-input
          v-model="searchFormParams.lotteryRecordId"
          placeholder="请输入关联抽奖记录"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="searchFormParams.source"
          placeholder="请输入来源"
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
    <PureTableBar title="小票订单表（系统核心交易表）列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('add')"
        >
          新增小票订单表（系统核心交易表）
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
          @click="CommonUtils.exportExcel(columns, dataList, '小票订单表（系统核心交易表）列表')"
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
          @page-size-change="getReceiptOrderList"
          @page-current-change="getReceiptOrderList"
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
              :title="`是否确认删除编号为${row.menuId}的这个小票订单表（系统核心交易表）`"
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

    <ReceiptOrder-form-modal
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
