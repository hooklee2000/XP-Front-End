<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  CustomerAddCommand,
  CustomerPageResponse,
  CustomerUpdateCommand,
  addCustomerApi,
  updateCustomerApi
} from "@/api/buz/Customer-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: CustomerPageResponse;
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

const formData = reactive<CustomerAddCommand | CustomerUpdateCommand>({
  // 顾客ID
  id: undefined,
  // 微信openid
  openid: undefined,
  // 微信unionid
  unionid: undefined,
  // 微信昵称
  nickname: undefined,
  // 手机号
  phone: undefined,
  // 省
  province: undefined,
  // 市
  city: undefined,
  // 县
  county: undefined,
  // 头像地址
  avatarUrl: undefined,
  // 累计中奖金额
  totalWinningAmount: undefined,
  // 累计提现金额
  totalWithdrawAmount: undefined,
  // 今日到账金额（风控）
  todayReceiveAmount: undefined,
  // 风险等级
  riskLevel: undefined,
  // 状态(1启用 0停用)
  status: undefined,
  // 是否同意顾客使用协议
  agreedUserProtocol: undefined,
  // 协议确认时间
  agreedProtocolTime: undefined,
  // 最后登录IP
  lastLoginIp: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "顾客ID不能为空"
  //   }
  // ],
  openid: [
    {
      required: true,
      message: "微信openid不能为空"
    }
  ],
  // unionid: [
  //   {
  //     required: true,
  //     message: "微信unionid不能为空"
  //   }
  // ],
  // nickname: [
  //   {
  //     required: true,
  //     message: "微信昵称不能为空"
  //   }
  // ],
  // phone: [
  //   {
  //     required: true,
  //     message: "手机号不能为空"
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
  //     message: "县不能为空"
  //   }
  // ],
  // avatarUrl: [
  //   {
  //     required: true,
  //     message: "头像地址不能为空"
  //   }
  // ],
  // totalWinningAmount: [
  //   {
  //     required: true,
  //     message: "累计中奖金额不能为空"
  //   }
  // ],
  // totalWithdrawAmount: [
  //   {
  //     required: true,
  //     message: "累计提现金额不能为空"
  //   }
  // ],
  // todayReceiveAmount: [
  //   {
  //     required: true,
  //     message: "今日到账金额（风控）不能为空"
  //   }
  // ],
  // riskLevel: [
  //   {
  //     required: true,
  //     message: "风险等级不能为空"
  //   }
  // ],
  // status: [
  //   {
  //     required: true,
  //     message: "状态(1启用 0停用)不能为空"
  //   }
  // ],
  // agreedUserProtocol: [
  //   {
  //     required: true,
  //     message: "是否同意顾客使用协议不能为空"
  //   }
  // ],
  // agreedProtocolTime: [
  //   {
  //     required: true,
  //     message: "协议确认时间不能为空"
  //   }
  // ],
  // lastLoginIp: [
  //   {
  //     required: true,
  //     message: "最后登录IP不能为空"
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
      await addCustomerApi(formData);
    } else if (props.type === "update") {
      await updateCustomerApi(formData as CustomerUpdateCommand);
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
    :title="type === 'add' ? '新增顾客表' : '更新顾客表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="顾客ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="openid" label="微信openid" required inline-message>
        <el-input v-model="formData.openid" />
      </el-form-item>
      <el-form-item prop="unionid" label="微信unionid" required inline-message>
        <el-input v-model="formData.unionid" />
      </el-form-item>
      <el-form-item prop="nickname" label="微信昵称" required inline-message>
        <el-input v-model="formData.nickname" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号" required inline-message>
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item prop="province" label="省" required inline-message>
        <el-input v-model="formData.province" />
      </el-form-item>
      <el-form-item prop="city" label="市" required inline-message>
        <el-input v-model="formData.city" />
      </el-form-item>
      <el-form-item prop="county" label="县" required inline-message>
        <el-input v-model="formData.county" />
      </el-form-item>
      <el-form-item prop="avatarUrl" label="头像地址" required inline-message>
        <el-input v-model="formData.avatarUrl" />
      </el-form-item>
      <el-form-item prop="totalWinningAmount" label="累计中奖金额" required inline-message>
        <el-input v-model="formData.totalWinningAmount" />
      </el-form-item>
      <el-form-item prop="totalWithdrawAmount" label="累计提现金额" required inline-message>
        <el-input v-model="formData.totalWithdrawAmount" />
      </el-form-item>
      <el-form-item prop="todayReceiveAmount" label="今日到账金额（风控）" required inline-message>
        <el-input v-model="formData.todayReceiveAmount" />
      </el-form-item>
      <el-form-item prop="riskLevel" label="风险等级" required inline-message>
        <el-input v-model="formData.riskLevel" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      <el-form-item prop="agreedUserProtocol" label="是否同意顾客使用协议" required inline-message>
        <el-input v-model="formData.agreedUserProtocol" />
      </el-form-item>
      <el-form-item prop="agreedProtocolTime" label="协议确认时间" required inline-message>
        <el-input v-model="formData.agreedProtocolTime" />
      </el-form-item>
      <el-form-item prop="lastLoginIp" label="最后登录IP" required inline-message>
        <el-input v-model="formData.lastLoginIp" />
      </el-form-item>
      
      <el-form-item prop="status" label="顾客表状态">
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
