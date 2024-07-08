const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");

const qrCodeDir = path.join(__dirname, "public");
if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir);
}

const initializeClient = () => {
  global.chatsCache = [];

  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
  });

  client.on("qr", async (qr) => {
    try {
      const qrCodeFilePath = path.join(qrCodeDir, "qrcode.png");
      await qrcode.toFile(qrCodeFilePath, qr);
      console.log(`QR code gerado e salvo em: ${qrCodeFilePath}`);
    } catch (error) {
      console.error("Erro ao gerar QR code:", error);
    }
  });

  client.on("ready", async () => {
    console.log("Client is ready!");

    global.chatsCache = await client.getChats();
    console.log("Chats cached.");

    setInterval(async () => {
      global.chatsCache = await client.getChats();
      console.log("Chats cache updated.");
    }, 20 * 60 * 1000);
  });

  client.initialize(() => {
    console.log("Client initialized.");
  });
};

module.exports = { initializeClient };
