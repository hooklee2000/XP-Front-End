<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  RiskControlLogAddCommand,
  RiskControlLogPageResponse,
  RiskControlLogUpdateCommand,
  addRiskControlLogApi,
  updateRiskControlLogApi
} from "@/api/buz/RiskControlLog-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: RiskControlLogPageResponse;
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

const formData = reactive<RiskControlLogAddCommand | RiskControlLogUpdateCommand>({
  // 风控日志ID
  id: undefined,
  // 顾客ID
  customerId: undefined,
  // 风险类别
  riskType: undefined,
  // 风险级别
  riskLevel: undefined,
  // 描述
  description: undefined,
  // IP
  ip: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "风控日志ID不能为空"
  //   }
  // ],
  customerId: [
    {
      required: true,
      message: "顾客ID不能为空"
    }
  ],
  riskType: [
    {
      required: true,
      message: "风险类别不能为空"
    }
  ],
  riskLevel: [
    {
      required: true,
      message: "风险级别不能为空"
    }
  ],
  description: [
    {
      required: true,
      message: "描述不能为空"
    }
  ],
  ip: [
    {
      required: true,
      message: "IP不能为空"
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
      await addRiskControlLogApi(formData);
    } else if (props.type === "update") {
      await updateRiskControlLogApi(formData as RiskControlLogUpdateCommand);
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
    :title="type === 'add' ? '新增风控日志表' : '更新风控日志表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="风控日志ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="customerId" label="顾客ID" required inline-message>
        <el-input v-model="formData.customerId" />
      </el-form-item>
      <el-form-item prop="riskType" label="风险类别" required inline-message>
        <el-input v-model="formData.riskType" />
      </el-form-item>
      <el-form-item prop="riskLevel" label="风险级别" required inline-message>
        <el-input v-model="formData.riskLevel" />
      </el-form-item>
      <el-form-item prop="description" label="描述" required inline-message>
        <el-input v-model="formData.description" />
      </el-form-item>
      <el-form-item prop="ip" label="IP" required inline-message>
        <el-input v-model="formData.ip" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="风控日志表状态">
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
