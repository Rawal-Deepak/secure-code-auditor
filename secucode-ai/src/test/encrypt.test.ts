import CryptoJS from "crypto-js";

const SECRET_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}
