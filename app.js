const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const app = express();
const PORT = 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

app.use(express.json());

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
