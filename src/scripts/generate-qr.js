const path = require("path");
const QRCode = require("qrcode");

const output = path.join(process.cwd(), "public", "hideaki-okamoto-qr.png");

QRCode.toFile(output, "https://algion.co.jp/hideaki/", {
  type: "png",
  width: 1024,
  margin: 4,
  errorCorrectionLevel: "H",
  color: { dark: "#050810", light: "#ffffff" },
}).then(() => {
  console.log(`Generated QR code: ${output}`);
}).catch((error) => {
  console.error("Failed to generate QR code:", error);
  process.exitCode = 1;
});
