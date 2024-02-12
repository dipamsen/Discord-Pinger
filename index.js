const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { default: axios } = require("axios");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send({
    send: "Discord~",
  });
});

const config = {
  headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
  },
};

const url = `https://discord.com/api/v10/channels/${process.env.DM_CHANNEL}/messages`;

app.get("/sendmessage", async (req, res) => {
  const { content } = req.query;
  if (!content) return res.status(400).json({ error: "No Content found" });
  try {
    const { data } = await axios.post(url, { content }, config);
    res.json(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/sendmessage", async (req, res) => {
  try {
    const { data } = await axios.post(url, req.body, config);
    res.json(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

const port = process.env.PORT || 2034;
app.listen(port, () => console.log(`Listening on ${port}`));
