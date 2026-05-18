<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  PosTerminalCashierAddCommand,
  PosTerminalCashierPageResponse,
  PosTerminalCashierUpdateCommand,
  addPosTerminalCashierApi,
  updatePosTerminalCashierApi
} from "@/api/buz/PosTerminalCashier-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: PosTerminalCashierPageResponse;
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

const formData = reactive<PosTerminalCashierAddCommand | PosTerminalCashierUpdateCommand>({
  // 关系ID
  id: undefined,
  // POS终端ID
  terminalId: undefined,
  // 收银员ID
  cashierId: undefined,
  // 班次
  shiftType: undefined,
  // 上机时间
  startTime: undefined,
  // 下机时间
  endTime: undefined,
  // 当前是否有效
  isActive: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "关系ID不能为空"
  //   }
  // ],
  terminalId: [
    {
      required: true,
      message: "POS终端ID不能为空"
    }
  ],
  cashierId: [
    {
      required: true,
      message: "收银员ID不能为空"
    }
  ],
  shiftType: [
    {
      required: true,
      message: "班次不能为空"
    }
  ],
  // startTime: [
  //   {
  //     required: true,
  //     message: "上机时间不能为空"
  //   }
  // ],
  // endTime: [
  //   {
  //     required: true,
  //     message: "下机时间不能为空"
  //   }
  // ],
  // isActive: [
  //   {
  //     required: true,
  //     message: "当前是否有效不能为空"
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
      await addPosTerminalCashierApi(formData);
    } else if (props.type === "update") {
      await updatePosTerminalCashierApi(formData as PosTerminalCashierUpdateCommand);
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
    :title="type === 'add' ? '新增POS终端与收银员关系表' : '更新POS终端与收银员关系表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="关系ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="terminalId" label="POS终端ID" required inline-message>
        <el-input v-model="formData.terminalId" />
      </el-form-item>
      <el-form-item prop="cashierId" label="收银员ID" required inline-message>
        <el-input v-model="formData.cashierId" />
      </el-form-item>
      <el-form-item prop="shiftType" label="班次" required inline-message>
        <el-input v-model="formData.shiftType" />
      </el-form-item>
      <el-form-item prop="startTime" label="上机时间" required inline-message>
        <el-input v-model="formData.startTime" />
      </el-form-item>
      <el-form-item prop="endTime" label="下机时间" required inline-message>
        <el-input v-model="formData.endTime" />
      </el-form-item>
      <el-form-item prop="isActive" label="当前是否有效" required inline-message>
        <el-input v-model="formData.isActive" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="POS终端与收银员关系表状态">
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
