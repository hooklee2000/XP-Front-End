<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  ReceiptParseLogAddCommand,
  ReceiptParseLogPageResponse,
  ReceiptParseLogUpdateCommand,
  addReceiptParseLogApi,
  updateReceiptParseLogApi
} from "@/api/buz/ReceiptParseLog-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: ReceiptParseLogPageResponse;
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

const formData = reactive<ReceiptParseLogAddCommand | ReceiptParseLogUpdateCommand>({
  // 日志ID
  id: undefined,
  // 顾客ID
  receiptOrderId: undefined,
  // 解析版本
  parserVersion: undefined,
  // 原始文本
  rawText: undefined,
  // 解析结果
  parsedJson: undefined,
  // 是否成功
  success: undefined,
  // 错误信息
  errorMsg: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "日志ID不能为空"
  //   }
  // ],
  receiptOrderId: [
    {
      required: true,
      message: "顾客ID不能为空"
    }
  ],
  parserVersion: [
    {
      required: true,
      message: "解析版本不能为空"
    }
  ],
  rawText: [
    {
      required: true,
      message: "原始文本不能为空"
    }
  ],
  parsedJson: [
    {
      required: true,
      message: "解析结果不能为空"
    }
  ],
  // success: [
  //   {
  //     required: true,
  //     message: "是否成功不能为空"
  //   }
  // ],
  // errorMsg: [
  //   {
  //     required: true,
  //     message: "错误信息不能为空"
  //   }
  // ],
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
      await addReceiptParseLogApi(formData);
    } else if (props.type === "update") {
      await updateReceiptParseLogApi(formData as ReceiptParseLogUpdateCommand);
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
    :title="type === 'add' ? '新增OCR解析日志' : '更新OCR解析日志'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="日志ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="receiptOrderId" label="顾客ID" required inline-message>
        <el-input v-model="formData.receiptOrderId" />
      </el-form-item>
      <el-form-item prop="parserVersion" label="解析版本" required inline-message>
        <el-input v-model="formData.parserVersion" />
      </el-form-item>
      <el-form-item prop="rawText" label="原始文本" required inline-message>
        <el-input v-model="formData.rawText" />
      </el-form-item>
      <el-form-item prop="parsedJson" label="解析结果" required inline-message>
        <el-input v-model="formData.parsedJson" />
      </el-form-item>
      <el-form-item prop="success" label="是否成功" required inline-message>
        <el-input v-model="formData.success" />
      </el-form-item>
      <el-form-item prop="errorMsg" label="错误信息" required inline-message>
        <el-input v-model="formData.errorMsg" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
     
      <el-form-item prop="status" label="OCR解析日志状态">
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
