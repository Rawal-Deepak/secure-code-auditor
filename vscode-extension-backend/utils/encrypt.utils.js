const crypto = require("crypto");
const ALGORITHM = "aes-256-ecb";
const SECRET = process.env.SECRET_KEY;
// const IV = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET, "hex"),
    null
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

module.exports = encrypt;
