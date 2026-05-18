<script setup lang="ts">
import VDialog from "@/components/VDialog/VDialog.vue";
import { computed, reactive, ref } from "vue";
import {
  ReceiptOrderItemAddCommand,
  ReceiptOrderItemPageResponse,
  ReceiptOrderItemUpdateCommand,
  addReceiptOrderItemApi,
  updateReceiptOrderItemApi
} from "@/api/buz/ReceiptOrderItem-client";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  type: "add" | "update";
  modelValue: boolean;
  row?: ReceiptOrderItemPageResponse;
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

const formData = reactive<ReceiptOrderItemAddCommand | ReceiptOrderItemUpdateCommand>({
  // 商品明细ID
  id: undefined,
  // 订单ID
  receiptOrderId: undefined,
  // 条码
  barcode: undefined,
  // OCR原始商品名
  rawName: undefined,
  // 标准商品ID
  productId: undefined,
  // 分类
  category: undefined,
  // 单位
  unit: undefined,
  // 是否称重商品
  isWeighted: undefined,
  // 数量
  quantity: undefined,
  // 原价
  originalPrice: undefined,
  // 执行价
  salePrice: undefined,
  // 行金额
  totalAmount: undefined,
  // OCR原始行
  rawLine: undefined,
  // 状态(1启用 0停用)
  status: undefined,
});

const statusList = useUserStoreHook().dictionaryMap["common.status"];

const rules: FormRules = {
  // id: [
  //   {
  //     required: true,
  //     message: "商品明细ID不能为空"
  //   }
  // ],
  receiptOrderId: [
    {
      required: true,
      message: "订单ID不能为空"
    }
  ],
  // barcode: [
  //   {
  //     required: true,
  //     message: "条码不能为空"
  //   }
  // ],
  rawName: [
    {
      required: true,
      message: "OCR原始商品名不能为空"
    }
  ],
  // productId: [
  //   {
  //     required: true,
  //     message: "标准商品ID不能为空"
  //   }
  // ],
  // category: [
  //   {
  //     required: true,
  //     message: "分类不能为空"
  //   }
  // ],
  // unit: [
  //   {
  //     required: true,
  //     message: "单位不能为空"
  //   }
  // ],
  // isWeighted: [
  //   {
  //     required: true,
  //     message: "是否称重商品不能为空"
  //   }
  // ],
  // quantity: [
  //   {
  //     required: true,
  //     message: "数量不能为空"
  //   }
  // ],
  // originalPrice: [
  //   {
  //     required: true,
  //     message: "原价不能为空"
  //   }
  // ],
  // salePrice: [
  //   {
  //     required: true,
  //     message: "执行价不能为空"
  //   }
  // ],
  // totalAmount: [
  //   {
  //     required: true,
  //     message: "行金额不能为空"
  //   }
  // ],
  // rawLine: [
  //   {
  //     required: true,
  //     message: "OCR原始行不能为空"
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
      await addReceiptOrderItemApi(formData);
    } else if (props.type === "update") {
      await updateReceiptOrderItemApi(formData as ReceiptOrderItemUpdateCommand);
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
    :title="type === 'add' ? '新增小票商品表' : '更新小票商品表'"
    v-model="visible"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="visible = false"
    @opened="handleOpened"
  >
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item prop="id" label="商品明细ID" required inline-message>
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="receiptOrderId" label="订单ID" required inline-message>
        <el-input v-model="formData.receiptOrderId" />
      </el-form-item>
      <el-form-item prop="barcode" label="条码" required inline-message>
        <el-input v-model="formData.barcode" />
      </el-form-item>
      <el-form-item prop="rawName" label="OCR原始商品名" required inline-message>
        <el-input v-model="formData.rawName" />
      </el-form-item>
      <el-form-item prop="productId" label="标准商品ID" required inline-message>
        <el-input v-model="formData.productId" />
      </el-form-item>
      <el-form-item prop="category" label="分类" required inline-message>
        <el-input v-model="formData.category" />
      </el-form-item>
      <el-form-item prop="unit" label="单位" required inline-message>
        <el-input v-model="formData.unit" />
      </el-form-item>
      <el-form-item prop="isWeighted" label="是否称重商品" required inline-message>
        <el-input v-model="formData.isWeighted" />
      </el-form-item>
      <el-form-item prop="quantity" label="数量" required inline-message>
        <el-input v-model="formData.quantity" />
      </el-form-item>
      <el-form-item prop="originalPrice" label="原价" required inline-message>
        <el-input v-model="formData.originalPrice" />
      </el-form-item>
      <el-form-item prop="salePrice" label="执行价" required inline-message>
        <el-input v-model="formData.salePrice" />
      </el-form-item>
      <el-form-item prop="totalAmount" label="行金额" required inline-message>
        <el-input v-model="formData.totalAmount" />
      </el-form-item>
      <el-form-item prop="rawLine" label="OCR原始行" required inline-message>
        <el-input v-model="formData.rawLine" />
      </el-form-item>
      <el-form-item prop="status" label="状态(1启用 0停用)" required inline-message>
        <el-input v-model="formData.status" />
      </el-form-item>
     
      <el-form-item prop="status" label="小票商品表状态">
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
