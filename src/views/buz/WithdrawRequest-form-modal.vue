<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  WithdrawRequestAddCommand,
  WithdrawRequestPageResponse,
  WithdrawRequestUpdateCommand,
  addWithdrawRequestApi,
  updateWithdrawRequestApi
} from "@/api/buz/WithdrawRequest-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: WithdrawRequestPageResponse;
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

const formData = reactive<WithdrawRequestAddCommand | WithdrawRequestUpdateCommand>({
  // 提现申请ID
  id: undefined,
  // 顾客ID
  customerId: undefined,
  // 提现金额
  amount: undefined,
  // 手续费
  feeAmount: undefined,
  // 实际到账金额
  actualAmount: undefined,
  // 状态(1已经提现 0申请提现)
  status: undefined,
  // 申请时间
  applyTime: undefined,
  // 打款时间
  payTime: undefined,
  // 操作员
  operatorName: undefined,
  // 备注
  remark: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "提现申请ID不能为空"
  //   }
  // ],
  customerId: [
    {
      required: true,
      message: "顾客ID不能为空"
    }
  ],
  amount: [
    {
      required: true,
      message: "提现金额不能为空"
    }
  ],
  // feeAmount: [
  //   {
  //     required: true,
  //     message: "手续费不能为空"
  //   }
  // ],
  // actualAmount: [
  //   {
  //     required: true,
  //     message: "实际到账金额不能为空"
  //   }
  // ],
  // status: [
  //   {
  //     required: true,
  //     message: "状态(1已经提现 0申请提现)不能为空"
  //   }
  // ],
  // applyTime: [
  //   {
  //     required: true,
  //     message: "申请时间不能为空"
  //   }
  // ],
  // payTime: [
  //   {
  //     required: true,
  //     message: "打款时间不能为空"
  //   }
  // ],
  // operatorName: [
  //   {
  //     required: true,
  //     message: "操作员不能为空"
  //   }
  // ],
  // remark: [
  //   {
  //     required: true,
  //     message: "备注不能为空"
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
      await addWithdrawRequestApi(formData);
    } else if (props.type === "update") {
      await updateWithdrawRequestApi(formData as WithdrawRequestUpdateCommand);
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
    :title="type === 'add' ? '新增提现申请表' : '更新提现申请表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="提现申请ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="customerId" label="顾客ID" required inline-message>
        <el-input v-model="formData.customerId" />
      </el-form-item>
      <el-form-item prop="amount" label="提现金额" required inline-message>
        <el-input v-model="formData.amount" />
      </el-form-item>
      <el-form-item prop="feeAmount" label="手续费" required inline-message>
        <el-input v-model="formData.feeAmount" />
      </el-form-item>
      <el-form-item prop="actualAmount" label="实际到账金额" required inline-message>
        <el-input v-model="formData.actualAmount" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1已经提现 0申请提现)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      <el-form-item prop="applyTime" label="申请时间" required inline-message>
        <el-input v-model="formData.applyTime" />
      </el-form-item>
      <el-form-item prop="payTime" label="打款时间" required inline-message>
        <el-input v-model="formData.payTime" />
      </el-form-item>
      <el-form-item prop="operatorName" label="操作员" required inline-message>
        <el-input v-model="formData.operatorName" />
      </el-form-item>
      <el-form-item prop="remark" label="备注" required inline-message>
        <el-input v-model="formData.remark" />
      </el-form-item>
     
      <el-form-item prop="status" label="提现申请表状态">
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
