<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  ProtocolAgreementAddCommand,
  ProtocolAgreementPageResponse,
  ProtocolAgreementUpdateCommand,
  addProtocolAgreementApi,
  updateProtocolAgreementApi
} from "@/api/buz/ProtocolAgreement-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: ProtocolAgreementPageResponse;
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

const formData = reactive<ProtocolAgreementAddCommand | ProtocolAgreementUpdateCommand>({
  // 协议记录ID
  id: undefined,
  // 协议记录ID
  customerId: undefined,
  // 协议类别
  protocolType: undefined,
  // 协议版本
  protocolVersion: undefined,
  // 是否同意
  agreed: undefined,
  // 同意时间
  agreedTime: undefined,
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
  //     message: "协议记录ID不能为空"
  //   }
  // ],
  customerId: [
    {
      required: true,
      message: "协议记录ID不能为空"
    }
  ],
  protocolType: [
    {
      required: true,
      message: "协议类别不能为空"
    }
  ],
  protocolVersion: [
    {
      required: true,
      message: "协议版本不能为空"
    }
  ],
  agreed: [
    {
      required: true,
      message: "是否同意不能为空"
    }
  ],
  agreedTime: [
    {
      required: true,
      message: "同意时间不能为空"
    }
  ],
  ip: [
    {
      required: true,
      message: "IP不能为空"
    }
  ],
  status: [
    {
      required: true,
      message: "状态(1启用 0停用)不能为空"
    }
  ],
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
      await addProtocolAgreementApi(formData);
    } else if (props.type === "update") {
      await updateProtocolAgreementApi(formData as ProtocolAgreementUpdateCommand);
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
    :title="type === 'add' ? '新增协议确认表' : '更新协议确认表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="协议记录ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="customerId" label="协议记录ID" required inline-message>
        <el-input v-model="formData.customerId" />
      </el-form-item>
      <el-form-item prop="protocolType" label="协议类别" required inline-message>
        <el-input v-model="formData.protocolType" />
      </el-form-item>
      <el-form-item prop="protocolVersion" label="协议版本" required inline-message>
        <el-input v-model="formData.protocolVersion" />
      </el-form-item>
      <el-form-item prop="agreed" label="是否同意" required inline-message>
        <el-input v-model="formData.agreed" />
      </el-form-item>
      <el-form-item prop="agreedTime" label="同意时间" required inline-message>
        <el-input v-model="formData.agreedTime" />
      </el-form-item>
      <el-form-item prop="ip" label="IP" required inline-message>
        <el-input v-model="formData.ip" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="协议确认表状态">
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
