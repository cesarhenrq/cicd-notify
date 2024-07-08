const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const qrCodeDir = path.join(__dirname, "public");
if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir);
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

client.on("qr", async (qr) => {
  try {
    // Caminho do arquivo de imagem
    const qrCodeFilePath = path.join(qrCodeDir, "qrcode.png");

    // Gerar QR code e salvar como imagem
    await qrcode.toFile(qrCodeFilePath, qr);

    console.log(`QR code gerado e salvo em: ${qrCodeFilePath}`);
  } catch (error) {
    console.error("Erro ao gerar QR code:", error);
  }
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

app.use(express.json());

app.use("/public", express.static(qrCodeDir));

app.post("/send-message", async (req, res) => {
  const { groupName, message } = req.body;

  try {
    const chats = await client.getChats();
    const groupChat = chats.find(
      (chat) => chat.isGroup && chat.name === groupName
    );

    if (groupChat) {
      await groupChat.sendMessage(message);
      res.status(200).send({ status: "Message sent" });
    } else {
      res.status(404).send({ error: "Group not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
