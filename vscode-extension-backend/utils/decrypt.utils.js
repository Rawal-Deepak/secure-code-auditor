const crypto = require("crypto");
const ALGORITHM = "aes-256-ecb";
const SECRET_KEY = process.env.SECRET_KEY;

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    null // no IV for ECB
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = decrypt;
