<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  ReceiptOrderAddCommand,
  ReceiptOrderPageResponse,
  ReceiptOrderUpdateCommand,
  addReceiptOrderApi,
  updateReceiptOrderApi
} from "@/api/buz/ReceiptOrder-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: ReceiptOrderPageResponse;
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

const formData = reactive<ReceiptOrderAddCommand | ReceiptOrderUpdateCommand>({
  // 订单ID
  id: undefined,
  // 顾客ID
  customerId: undefined,
  // 门店ID
  storeId: undefined,
  // POS终端ID
  terminalId: undefined,
  // 收银员ID
  cashierId: undefined,
  // 班次关系ID
  terminalCashierId: undefined,
  // 小票单号
  receiptNo: undefined,
  // 小票时间
  receiptTime: undefined,
  // 支付时间
  paymentTime: undefined,
  // 重打时间
  reprintTime: undefined,
  // 是否重打单
  isReprint: undefined,
  // 会员号
  memberNo: undefined,
  // 会员手机号
  memberPhone: undefined,
  // 会员姓名
  memberName: undefined,
  // 本次积分
  pointsEarned: undefined,
  // 累计积分
  pointsTotal: undefined,
  // 商品种类数
  totalItems: undefined,
  // 商品总数量
  totalQuantity: undefined,
  // 订单原价
  originalAmount: undefined,
  // 优惠金额
  discountAmount: undefined,
  // 优惠券金额
  couponAmount: undefined,
  // 抹零金额
  roundingAmount: undefined,
  // 应付金额
  payableAmount: undefined,
  // 实付金额
  paidAmount: undefined,
  // 现金支付
  cashAmount: undefined,
  // 微信支付
  wechatAmount: undefined,
  // 支付宝支付
  alipayAmount: undefined,
  // 支付流水号
  paymentSerialNo: undefined,
  // 促销描述
  promotionDesc: undefined,
  // 小票图片
  imageUrl: undefined,
  // OCR原始文本
  ocrText: undefined,
  // 结构化解析结果
  parsedData: undefined,
  // 校验状态(1通过 0失败)
  verifyStatus: undefined,
  // 失败原因
  verifyFailReason: undefined,
  // 是否有效
  isValid: undefined,
  // 是否符合抽奖
  isLotteryQualified: undefined,
  // 关联抽奖记录
  lotteryRecordId: undefined,
  // 来源
  source: undefined,
  // 状态(1启用 0停用)
  status: undefined,
 
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "订单ID不能为空"
  //   }
  // ],
  customerId: [
    {
      required: true,
      message: "顾客ID不能为空"
    }
  ],
  storeId: [
    {
      required: true,
      message: "门店ID不能为空"
    }
  ],
  // terminalId: [
  //   {
  //     required: true,
  //     message: "POS终端ID不能为空"
  //   }
  // ],
  // cashierId: [
  //   {
  //     required: true,
  //     message: "收银员ID不能为空"
  //   }
  // ],
  // terminalCashierId: [
  //   {
  //     required: true,
  //     message: "班次关系ID不能为空"
  //   }
  // ],
  receiptNo: [
    {
      required: true,
      message: "小票单号不能为空"
    }
  ],
  receiptTime: [
    {
      required: true,
      message: "小票时间不能为空"
    }
  ],
  // paymentTime: [
  //   {
  //     required: true,
  //     message: "支付时间不能为空"
  //   }
  // ],
  // reprintTime: [
  //   {
  //     required: true,
  //     message: "重打时间不能为空"
  //   }
  // ],
  // isReprint: [
  //   {
  //     required: true,
  //     message: "是否重打单不能为空"
  //   }
  // ],
  // memberNo: [
  //   {
  //     required: true,
  //     message: "会员号不能为空"
  //   }
  // ],
  // memberPhone: [
  //   {
  //     required: true,
  //     message: "会员手机号不能为空"
  //   }
  // ],
  // memberName: [
  //   {
  //     required: true,
  //     message: "会员姓名不能为空"
  //   }
  // ],
  // pointsEarned: [
  //   {
  //     required: true,
  //     message: "本次积分不能为空"
  //   }
  // ],
  // pointsTotal: [
  //   {
  //     required: true,
  //     message: "累计积分不能为空"
  //   }
  // ],
  // totalItems: [
  //   {
  //     required: true,
  //     message: "商品种类数不能为空"
  //   }
  // ],
  // totalQuantity: [
  //   {
  //     required: true,
  //     message: "商品总数量不能为空"
  //   }
  // ],
  // originalAmount: [
  //   {
  //     required: true,
  //     message: "订单原价不能为空"
  //   }
  // ],
  // discountAmount: [
  //   {
  //     required: true,
  //     message: "优惠金额不能为空"
  //   }
  // ],
  // couponAmount: [
  //   {
  //     required: true,
  //     message: "优惠券金额不能为空"
  //   }
  // ],
  // roundingAmount: [
  //   {
  //     required: true,
  //     message: "抹零金额不能为空"
  //   }
  // ],
  // payableAmount: [
  //   {
  //     required: true,
  //     message: "应付金额不能为空"
  //   }
  // ],
  // paidAmount: [
  //   {
  //     required: true,
  //     message: "实付金额不能为空"
  //   }
  // ],
  // cashAmount: [
  //   {
  //     required: true,
  //     message: "现金支付不能为空"
  //   }
  // ],
  // wechatAmount: [
  //   {
  //     required: true,
  //     message: "微信支付不能为空"
  //   }
  // ],
  // alipayAmount: [
  //   {
  //     required: true,
  //     message: "支付宝支付不能为空"
  //   }
  // ],
  // paymentSerialNo: [
  //   {
  //     required: true,
  //     message: "支付流水号不能为空"
  //   }
  // ],
  // promotionDesc: [
  //   {
  //     required: true,
  //     message: "促销描述不能为空"
  //   }
  // ],
  imageUrl: [
    {
      required: true,
      message: "小票图片不能为空"
    }
  ],
  // ocrText: [
  //   {
  //     required: true,
  //     message: "OCR原始文本不能为空"
  //   }
  // ],
  // parsedData: [
  //   {
  //     required: true,
  //     message: "结构化解析结果不能为空"
  //   }
  // ],
  // verifyStatus: [
  //   {
  //     required: true,
  //     message: "校验状态(1通过 0失败)不能为空"
  //   }
  // ],
  // verifyFailReason: [
  //   {
  //     required: true,
  //     message: "失败原因不能为空"
  //   }
  // ],
  // isValid: [
  //   {
  //     required: true,
  //     message: "是否有效不能为空"
  //   }
  // ],
  // isLotteryQualified: [
  //   {
  //     required: true,
  //     message: "是否符合抽奖不能为空"
  //   }
  // ],
  // lotteryRecordId: [
  //   {
  //     required: true,
  //     message: "关联抽奖记录不能为空"
  //   }
  // ],
  // source: [
  //   {
  //     required: true,
  //     message: "来源不能为空"
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
      await addReceiptOrderApi(formData);
    } else if (props.type === "update") {
      await updateReceiptOrderApi(formData as ReceiptOrderUpdateCommand);
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
    :title="type === 'add' ? '新增小票订单表（系统核心交易表）' : '更新小票订单表（系统核心交易表）'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="订单ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="customerId" label="顾客ID" required inline-message>
        <el-input v-model="formData.customerId" />
      </el-form-item>
      <el-form-item prop="storeId" label="门店ID" required inline-message>
        <el-input v-model="formData.storeId" />
      </el-form-item>
      <el-form-item prop="terminalId" label="POS终端ID" required inline-message>
        <el-input v-model="formData.terminalId" />
      </el-form-item>
      <el-form-item prop="cashierId" label="收银员ID" required inline-message>
        <el-input v-model="formData.cashierId" />
      </el-form-item>
      <el-form-item prop="terminalCashierId" label="班次关系ID" required inline-message>
        <el-input v-model="formData.terminalCashierId" />
      </el-form-item>
      <el-form-item prop="receiptNo" label="小票单号" required inline-message>
        <el-input v-model="formData.receiptNo" />
      </el-form-item>
      <el-form-item prop="receiptTime" label="小票时间" required inline-message>
        <el-input v-model="formData.receiptTime" />
      </el-form-item>
      <el-form-item prop="paymentTime" label="支付时间"  inline-message>
        <el-input v-model="formData.paymentTime" />
      </el-form-item>
      <el-form-item prop="reprintTime" label="重打时间" required inline-message>
        <el-input v-model="formData.reprintTime" />
      </el-form-item>
      <el-form-item prop="isReprint" label="是否重打单" required inline-message>
        <el-input v-model="formData.isReprint" />
      </el-form-item>
      <el-form-item prop="memberNo" label="会员号" required inline-message>
        <el-input v-model="formData.memberNo" />
      </el-form-item>
      <el-form-item prop="memberPhone" label="会员手机号" required inline-message>
        <el-input v-model="formData.memberPhone" />
      </el-form-item>
      <el-form-item prop="memberName" label="会员姓名" required inline-message>
        <el-input v-model="formData.memberName" />
      </el-form-item>
      <el-form-item prop="pointsEarned" label="本次积分" required inline-message>
        <el-input v-model="formData.pointsEarned" />
      </el-form-item>
      <el-form-item prop="pointsTotal" label="累计积分" required inline-message>
        <el-input v-model="formData.pointsTotal" />
      </el-form-item>
      <el-form-item prop="totalItems" label="商品种类数" required inline-message>
        <el-input v-model="formData.totalItems" />
      </el-form-item>
      <el-form-item prop="totalQuantity" label="商品总数量" required inline-message>
        <el-input v-model="formData.totalQuantity" />
      </el-form-item>
      <el-form-item prop="originalAmount" label="订单原价" required inline-message>
        <el-input v-model="formData.originalAmount" />
      </el-form-item>
      <el-form-item prop="discountAmount" label="优惠金额" required inline-message>
        <el-input v-model="formData.discountAmount" />
      </el-form-item>
      <el-form-item prop="couponAmount" label="优惠券金额" required inline-message>
        <el-input v-model="formData.couponAmount" />
      </el-form-item>
      <el-form-item prop="roundingAmount" label="抹零金额" required inline-message>
        <el-input v-model="formData.roundingAmount" />
      </el-form-item>
      <el-form-item prop="payableAmount" label="应付金额" required inline-message>
        <el-input v-model="formData.payableAmount" />
      </el-form-item>
      <el-form-item prop="paidAmount" label="实付金额" required inline-message>
        <el-input v-model="formData.paidAmount" />
      </el-form-item>
      <el-form-item prop="cashAmount" label="现金支付" required inline-message>
        <el-input v-model="formData.cashAmount" />
      </el-form-item>
      <el-form-item prop="wechatAmount" label="微信支付" required inline-message>
        <el-input v-model="formData.wechatAmount" />
      </el-form-item>
      <el-form-item prop="alipayAmount" label="支付宝支付" required inline-message>
        <el-input v-model="formData.alipayAmount" />
      </el-form-item>
      <el-form-item prop="paymentSerialNo" label="支付流水号" required inline-message>
        <el-input v-model="formData.paymentSerialNo" />
      </el-form-item>
      <el-form-item prop="promotionDesc" label="促销描述" required inline-message>
        <el-input v-model="formData.promotionDesc" />
      </el-form-item>
      <el-form-item prop="imageUrl" label="小票图片" required inline-message>
        <el-input v-model="formData.imageUrl" />
      </el-form-item>
      <el-form-item prop="ocrText" label="OCR原始文本" required inline-message>
        <el-input v-model="formData.ocrText" />
      </el-form-item>
      <el-form-item prop="parsedData" label="结构化解析结果" required inline-message>
        <el-input v-model="formData.parsedData" />
      </el-form-item>
      <el-form-item prop="verifyStatus" label="校验状态(1通过 0失败)" required inline-message>
        <el-input v-model="formData.verifyStatus" />
      </el-form-item>
      <el-form-item prop="verifyFailReason" label="失败原因" required inline-message>
        <el-input v-model="formData.verifyFailReason" />
      </el-form-item>
      <el-form-item prop="isValid" label="是否有效" required inline-message>
        <el-input v-model="formData.isValid" />
      </el-form-item>
      <el-form-item prop="isLotteryQualified" label="是否符合抽奖" required inline-message>
        <el-input v-model="formData.isLotteryQualified" />
      </el-form-item>
      <el-form-item prop="lotteryRecordId" label="关联抽奖记录" required inline-message>
        <el-input v-model="formData.lotteryRecordId" />
      </el-form-item>
      <el-form-item prop="source" label="来源" required inline-message>
        <el-input v-model="formData.source" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
      
      <el-form-item prop="status" label="小票订单表（系统核心交易表）状态">
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
