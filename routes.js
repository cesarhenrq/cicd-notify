const express = require("express");

const router = express.Router();

router.post("/send-message", async (req, res) => {
  console.log("body: ", req.body);
  console.log("date: ", new Date());
  const { groupName, message } = req.body;

  try {
    const groupChat = global.chatsCache.find(
      (chat) => chat.isGroup && chat.name === groupName
    );

    if (groupChat) {
      await groupChat.sendMessage(message);
      res.status(200).send({ status: "Message sent" });
    } else {
      res.status(404).send({ error: "Group not found" });
    }
  } catch (error) {
    console.log("Error sending message:", error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
