// generate-secret.js
const crypto = require('crypto');

// 64 baytlık rastgele veri oluşturur ve bunu onaltılık (hex) string'e çevirir.
// Bu, 128 karakter uzunluğunda, son derece güçlü ve rastgele bir anahtar demektir.
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log("Oluşturulan JWT Gizli Anahtarı:");
console.log(jwtSecret);
console.log("\nBu anahtarı kopyala ve .env dosyana yapıştır!");