<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  LotteryRecordAddCommand,
  LotteryRecordPageResponse,
  LotteryRecordUpdateCommand,
  addLotteryRecordApi,
  updateLotteryRecordApi
} from "@/api/buz/LotteryRecord-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: LotteryRecordPageResponse;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "success"): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set(v) {
    emits("update:modelValue", v);
  }
});

const formData = reactive<LotteryRecordAddCommand | LotteryRecordUpdateCommand>({
  // 抽奖记录ID
  id: undefined,
  // 顾客ID
  customerId: undefined,
  // 门店ID
  storeId: undefined,
  // 订单号
  receiptOrderId: undefined,
  // 抽奖编号
  lotteryNo: undefined,
  // 奖项名称
  prizeName: undefined,
  // 中奖金额
  prizeAmount: undefined,
  // 是否中奖
  isWinning: undefined,
  // 抽奖时间
  lotteryTime: undefined,
  // 提现状态(1提现 0未提现)
  withdrawStatus: undefined,
  // 状态(1已经提现 0申请提现 -1初始))
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "抽奖记录ID不能为空"
  //   }
  // ],
  customerId: [
    {
      required: true,
      message: "顾客ID不能为空"
    }
  ],
  storeId: [
    {
      required: true,
      message: "门店ID不能为空"
    }
  ],
  receiptOrderId: [
    {
      required: true,
      message: "订单号不能为空"
    }
  ],
  lotteryNo: [
    {
      required: true,
      message: "抽奖编号不能为空"
    }
  ],
  prizeName: [
    {
      required: true,
      message: "奖项名称不能为空"
    }
  ],
  prizeAmount: [
    {
      required: true,
      message: "中奖金额不能为空"
    }
  ],
  isWinning: [
    {
      required: true,
      message: "是否中奖不能为空"
    }
  ],
  // lotteryTime: [
  //   {
  //     required: true,
  //     message: "抽奖时间不能为空"
  //   }
  // ],
  // withdrawStatus: [
  //   {
  //     required: true,
  //     message: "提现状态(1提现 0未提现)不能为空"
  //   }
  // ],
  // status: [
  //   {
  //     required: true,
  //     message: "状态(1已经提现 0申请提现 -1初始))不能为空"
  //   }
  // ],
  // : [
  //   {
  //     required: true,
  //     message: "创建时间不能为空"
  //   }
  // ],
};
const formRef = ref<FormInstance>();
function handleOpened() {
  if (props.row) {
    Object.assign(formData, props.row);
  } else {
    formRef.value?.resetFields();
  }
}

const loading = ref(false);
async function handleConfirm() {
  try {
    loading.value = true;
    if (props.type === "add") {
      await addLotteryRecordApi(formData);
    } else if (props.type === "update") {
      await updateLotteryRecordApi(formData as LotteryRecordUpdateCommand);
    }
    ElMessage.info("提交成功");
    visible.value = false;
    emits("success");
  } catch (e) {
    console.error(e);
    ElMessage.error((e as Error)?.message || "提交失败");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog
    show-full-screen
    :fixed-body-height="false"
    use-body-scrolling
    :title="type === 'add' ? '新增抽奖记录表' : '更新抽奖记录表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="抽奖记录ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="customerId" label="顾客ID" required inline-message>
        <el-input v-model="formData.customerId" />
      </el-form-item>
      <el-form-item prop="storeId" label="门店ID" required inline-message>
        <el-input v-model="formData.storeId" />
      </el-form-item>
      <el-form-item prop="receiptOrderId" label="订单号" required inline-message>
        <el-input v-model="formData.receiptOrderId" />
      </el-form-item>
      <el-form-item prop="lotteryNo" label="抽奖编号" required inline-message>
        <el-input v-model="formData.lotteryNo" />
      </el-form-item>
      <el-form-item prop="prizeName" label="奖项名称" required inline-message>
        <el-input v-model="formData.prizeName" />
      </el-form-item>
      <el-form-item prop="prizeAmount" label="中奖金额" required inline-message>
        <el-input v-model="formData.prizeAmount" />
      </el-form-item>
      <el-form-item prop="isWinning" label="是否中奖" required inline-message>
        <el-input v-model="formData.isWinning" />
      </el-form-item>
      <el-form-item prop="lotteryTime" label="抽奖时间"  inline-message>
        <el-input v-model="formData.lotteryTime" />
      </el-form-item>
      <el-form-item prop="withdrawStatus" label="提现状态(1提现 0未提现)" required inline-message>
        <el-input v-model="formData.withdrawStatus" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1已经提现 0申请提现 -1初始))" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="抽奖记录表状态">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="item in Object.keys(statusList)"
            :key="item"
            :label="statusList[item].value"
          >
            {{ statusList[item].label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="remark" label="备注" style="margin-bottom: undefined">
        <el-input type="textarea" v-model="formData.remark" />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>
