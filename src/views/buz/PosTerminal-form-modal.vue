<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  PosTerminalAddCommand,
  PosTerminalPageResponse,
  PosTerminalUpdateCommand,
  addPosTerminalApi,
  updatePosTerminalApi
} from "@/api/buz/PosTerminal-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: PosTerminalPageResponse;
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

const formData = reactive<PosTerminalAddCommand | PosTerminalUpdateCommand>({
  // POS终端ID
  id: undefined,
  // 所属门店
  storeId: undefined,
  // 机号
  terminalNo: undefined,
  // 设备序列号
  deviceSn: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "POS终端ID不能为空"
  //   }
  // ],
  storeId: [
    {
      required: true,
      message: "所属门店不能为空"
    }
  ],
  terminalNo: [
    {
      required: true,
      message: "机号不能为空"
    }
  ],
  deviceSn: [
    {
      required: true,
      message: "设备序列号不能为空"
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
      await addPosTerminalApi(formData);
    } else if (props.type === "update") {
      await updatePosTerminalApi(formData as PosTerminalUpdateCommand);
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
    :title="type === 'add' ? '新增POS终端表' : '更新POS终端表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="POS终端ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="storeId" label="所属门店" required inline-message>
        <el-input v-model="formData.storeId" />
      </el-form-item>
      <el-form-item prop="terminalNo" label="机号" required inline-message>
        <el-input v-model="formData.terminalNo" />
      </el-form-item>
      <el-form-item prop="deviceSn" label="设备序列号" required inline-message>
        <el-input v-model="formData.deviceSn" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
     
      <el-form-item prop="status" label="POS终端表状态">
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
