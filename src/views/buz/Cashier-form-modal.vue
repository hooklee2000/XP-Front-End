<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  CashierAddCommand,
  CashierPageResponse,
  CashierUpdateCommand,
  addCashierApi,
  updateCashierApi
} from "@/api/buz/Cashier-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: CashierPageResponse;
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

const formData = reactive<CashierAddCommand | CashierUpdateCommand>({
  // 收银员ID
  id: undefined,
  // 所属门店
  storeId: undefined,
  // 收银员工号
  cashierCode: undefined,
  // 姓名
  name: undefined,
  // 手机号码
  phone: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "收银员ID不能为空"
  //   }
  // ],
  storeId: [
    {
      required: true,
      message: "所属门店不能为空"
    }
  ],
  cashierCode: [
    {
      required: true,
      message: "收银员工号不能为空"
    }
  ],
  name: [
    {
      required: true,
      message: "姓名不能为空"
    }
  ],
  phone: [
    {
      required: true,
      message: "手机号码不能为空"
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
      await addCashierApi(formData);
    } else if (props.type === "update") {
      await updateCashierApi(formData as CashierUpdateCommand);
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
    :title="type === 'add' ? '新增收银员表' : '更新收银员表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="收银员ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="storeId" label="所属门店" required inline-message>
        <el-input v-model="formData.storeId" />
      </el-form-item>
      <el-form-item prop="cashierCode" label="收银员工号" required inline-message>
        <el-input v-model="formData.cashierCode" />
      </el-form-item>
      <el-form-item prop="name" label="姓名" required inline-message>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号码" required inline-message>
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="收银员表状态">
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
