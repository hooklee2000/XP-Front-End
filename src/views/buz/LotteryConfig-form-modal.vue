<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  LotteryConfigAddCommand,
  LotteryConfigPageResponse,
  LotteryConfigUpdateCommand,
  addLotteryConfigApi,
  updateLotteryConfigApi
} from "@/api/buz/LotteryConfig-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: LotteryConfigPageResponse;
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

const formData = reactive<LotteryConfigAddCommand | LotteryConfigUpdateCommand>({
  // 配置ID
  id: undefined,
  // 门店ID
  storeId: undefined,
  // 奖项名称
  prizeName: undefined,
  // 中奖金额
  prizeAmount: undefined,
  // 中奖概率
  probability: undefined,
  // 每日限制
  dailyLimit: undefined,
  // 每周限制
  weeklyLimit: undefined,
  // 每月限制
  monthlyLimit: undefined,
  // 是否大奖
  isSpecialPrize: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "配置ID不能为空"
  //   }
  // ],
  storeId: [
    {
      required: true,
      message: "门店ID不能为空"
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
  probability: [
    {
      required: true,
      message: "中奖概率不能为空"
    }
  ],
  dailyLimit: [
    {
      required: true,
      message: "每日限制不能为空"
    }
  ],
  weeklyLimit: [
    {
      required: true,
      message: "每周限制不能为空"
    }
  ],
  monthlyLimit: [
    {
      required: true,
      message: "每月限制不能为空"
    }
  ],
  isSpecialPrize: [
    {
      required: true,
      message: "是否大奖不能为空"
    }
  ],
  // status: [
  //   {
  //     required: true,
  //     message: "状态(1启用 0停用)不能为空"
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
      await addLotteryConfigApi(formData);
    } else if (props.type === "update") {
      await updateLotteryConfigApi(formData as LotteryConfigUpdateCommand);
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
    :title="type === 'add' ? '新增抽奖配置表' : '更新抽奖配置表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="配置ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="storeId" label="门店ID" required inline-message>
        <el-input v-model="formData.storeId" />
      </el-form-item>
      <el-form-item prop="prizeName" label="奖项名称" required inline-message>
        <el-input v-model="formData.prizeName" />
      </el-form-item>
      <el-form-item prop="prizeAmount" label="中奖金额" required inline-message>
        <el-input v-model="formData.prizeAmount" />
      </el-form-item>
      <el-form-item prop="probability" label="中奖概率" required inline-message>
        <el-input v-model="formData.probability" />
      </el-form-item>
      <el-form-item prop="dailyLimit" label="每日限制" required inline-message>
        <el-input v-model="formData.dailyLimit" />
      </el-form-item>
      <el-form-item prop="weeklyLimit" label="每周限制" required inline-message>
        <el-input v-model="formData.weeklyLimit" />
      </el-form-item>
      <el-form-item prop="monthlyLimit" label="每月限制" required inline-message>
        <el-input v-model="formData.monthlyLimit" />
      </el-form-item>
      <el-form-item prop="isSpecialPrize" label="是否大奖" required inline-message>
        <el-input v-model="formData.isSpecialPrize" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="抽奖配置表状态">
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
