const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");
const { initializeClient } = require("./whatsappClient");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeClient();
});
