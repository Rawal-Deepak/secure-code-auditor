import CryptoJS from "crypto-js";

const SECRET_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
