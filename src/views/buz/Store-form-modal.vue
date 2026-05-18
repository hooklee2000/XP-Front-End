<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  StoreAddCommand,
  StorePageResponse,
  StoreUpdateCommand,
  addStoreApi,
  updateStoreApi
} from "@/api/buz/Store-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: StorePageResponse;
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

const formData = reactive<StoreAddCommand | StoreUpdateCommand>({
  // 门店ID
  id: undefined,
  // 门店全称
  name: undefined,
  // 门店简称（滚动展示）
  shortName: undefined,
  // 品牌名称
  brand: undefined,
  // 省
  province: undefined,
  // 市
  city: undefined,
  // 区县
  county: undefined,
  // 街道镇乡
  street: undefined,
  // 详细地址
  address: undefined,
  // 联系负责人
  contactPerson: undefined,
  // 联系人电话
  contactPhone: undefined,
  // 营业执照号
  businessLicenseNo: undefined,
  // 是否启用抽奖
  lotteryEnabled: undefined,
  // 最低抽奖金额
  lotteryMinAmount: undefined,
  // 每日预算
  dailyBudget: undefined,
  // 每月预算
  monthlyBudget: undefined,
  // 服务费比例
  serviceFeeRate: undefined,
  // 目标增长营业额
  targetGrowthAmount: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "门店ID不能为空"
  //   }
  // ],
  name: [
    {
      required: true,
      message: "门店全称不能为空"
    }
  ],
  shortName: [
    {
      required: true,
      message: "门店简称（滚动展示）不能为空"
    }
  ],
  // brand: [
  //   {
  //     required: true,
  //     message: "品牌名称不能为空"
  //   }
  // ],
  // province: [
  //   {
  //     required: true,
  //     message: "省不能为空"
  //   }
  // ],
  // city: [
  //   {
  //     required: true,
  //     message: "市不能为空"
  //   }
  // ],
  // county: [
  //   {
  //     required: true,
  //     message: "区县不能为空"
  //   }
  // ],
  // street: [
  //   {
  //     required: true,
  //     message: "街道镇乡不能为空"
  //   }
  // ],
  // address: [
  //   {
  //     required: true,
  //     message: "详细地址不能为空"
  //   }
  // ],
  // contactPerson: [
  //   {
  //     required: true,
  //     message: "联系负责人不能为空"
  //   }
  // ],
  // contactPhone: [
  //   {
  //     required: true,
  //     message: "联系人电话不能为空"
  //   }
  // ],
  // businessLicenseNo: [
  //   {
  //     required: true,
  //     message: "营业执照号不能为空"
  //   }
  // ],
  // lotteryEnabled: [
  //   {
  //     required: true,
  //     message: "是否启用抽奖不能为空"
  //   }
  // ],
  // lotteryMinAmount: [
  //   {
  //     required: true,
  //     message: "最低抽奖金额不能为空"
  //   }
  // ],
  // dailyBudget: [
  //   {
  //     required: true,
  //     message: "每日预算不能为空"
  //   }
  // ],
  // monthlyBudget: [
  //   {
  //     required: true,
  //     message: "每月预算不能为空"
  //   }
  // ],
  // serviceFeeRate: [
  //   {
  //     required: true,
  //     message: "服务费比例不能为空"
  //   }
  // ],
  // targetGrowthAmount: [
  //   {
  //     required: true,
  //     message: "目标增长营业额不能为空"
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
      await addStoreApi(formData);
    } else if (props.type === "update") {
      await updateStoreApi(formData as StoreUpdateCommand);
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
    :title="type === 'add' ? '新增门店表' : '更新门店表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="门店ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="name" label="门店全称" required inline-message>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item prop="shortName" label="门店简称（滚动展示）" required inline-message>
        <el-input v-model="formData.shortName" />
      </el-form-item>
      <el-form-item prop="brand" label="品牌名称" required inline-message>
        <el-input v-model="formData.brand" />
      </el-form-item>
      <el-form-item prop="province" label="省" required inline-message>
        <el-input v-model="formData.province" />
      </el-form-item>
      <el-form-item prop="city" label="市" required inline-message>
        <el-input v-model="formData.city" />
      </el-form-item>
      <el-form-item prop="county" label="区县" required inline-message>
        <el-input v-model="formData.county" />
      </el-form-item>
      <el-form-item prop="street" label="街道镇乡" required inline-message>
        <el-input v-model="formData.street" />
      </el-form-item>
      <el-form-item prop="address" label="详细地址" required inline-message>
        <el-input v-model="formData.address" />
      </el-form-item>
      <el-form-item prop="contactPerson" label="联系负责人" required inline-message>
        <el-input v-model="formData.contactPerson" />
      </el-form-item>
      <el-form-item prop="contactPhone" label="联系人电话" required inline-message>
        <el-input v-model="formData.contactPhone" />
      </el-form-item>
      <el-form-item prop="businessLicenseNo" label="营业执照号" required inline-message>
        <el-input v-model="formData.businessLicenseNo" />
      </el-form-item>
      <el-form-item prop="lotteryEnabled" label="是否启用抽奖" required inline-message>
        <el-input v-model="formData.lotteryEnabled" />
      </el-form-item>
      <el-form-item prop="lotteryMinAmount" label="最低抽奖金额" required inline-message>
        <el-input v-model="formData.lotteryMinAmount" />
      </el-form-item>
      <el-form-item prop="dailyBudget" label="每日预算" required inline-message>
        <el-input v-model="formData.dailyBudget" />
      </el-form-item>
      <el-form-item prop="monthlyBudget" label="每月预算" required inline-message>
        <el-input v-model="formData.monthlyBudget" />
      </el-form-item>
      <el-form-item prop="serviceFeeRate" label="服务费比例" required inline-message>
        <el-input v-model="formData.serviceFeeRate" />
      </el-form-item>
      <el-form-item prop="targetGrowthAmount" label="目标增长营业额" required inline-message>
        <el-input v-model="formData.targetGrowthAmount" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="门店表状态">
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
