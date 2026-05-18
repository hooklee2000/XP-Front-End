import { JSEncrypt } from "jsencrypt";
import * as CryptoJS from "crypto-js";
import { isEmpty } from "@pureadmin/utils";

// 密钥对生成 http://web.chacuo.net/netrsakeypair
// 流行是pkcs#8格式
// RSA 公钥 对应的私钥放在后端项目的application-basic.yml文件下
const publicKey =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA65cBX6hi14rEw7v36NI6q17qVdDBu8TZQfp3wruhnwWRpHxF7sgYV1eMV1XY/+W3XgJeeIoJWrJDSiEyoXUKEOFNL+Om6Z3aIiZUJLLbZUOxDotidxpQJzPFwmgG6/aEWVBFJTkBtPFukJiGFLhvZ3NTZDQsT4wVgPZKzAap7pT0mlwcq+O6vC/Z4ewleBwdNdYtm9/pICG090jUmEruol/hE8T4JfjXtPc+AwG+GAQ9uNV3NjXPDPF9N4J8M8Nnw03jMQuyVKHtOU8jgut4oAkOWgc/weXnmoFacjCp04e2x6Qbn62m62dhSNtVSq+czGj/OLPhmHnm3JM5unlh4wIDAQAB";

// 加密
export function rsaEncrypt(txt): string {
  const encryptor = new JSEncrypt();
  // 设置公钥
  encryptor.setPublicKey(publicKey);
  // 对数据进行加密
  const encryptedValue = encryptor.encrypt(txt);

  // Check if the encrypted value is a boolean
  if (typeof encryptedValue === "boolean") {
    throw new Error("Encryption failed: Encrypted value returned a boolean");
  }

  return encryptedValue;
}

const aesKey = "xp1234567yt";

export function aesEncrypt(txt): string {
  if (isEmpty(txt)) {
    return null;
  }
  const message = CryptoJS.enc.Utf8.parse(txt);
  const secretPassphrase = CryptoJS.enc.Utf8.parse(aesKey);
  const iv = CryptoJS.enc.Utf8.parse(aesKey);

  const encrypted = CryptoJS.AES.encrypt(message, secretPassphrase, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv
  }).toString();
  return encrypted;
}

export function aesDecrypt(txtEncrypt): string {
  const secretPassphrase = CryptoJS.enc.Utf8.parse(aesKey);
  const iv = CryptoJS.enc.Utf8.parse(aesKey);
  const decrypted = CryptoJS.AES.decrypt(txtEncrypt, secretPassphrase, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
