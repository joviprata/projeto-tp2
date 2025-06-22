const express = require("express");
const cors = require("cors");

const logger = require("./config/logger");
const morgan = require("morgan");
const app = express();

const authRoutes = require("./routes/auth_route");
const supermarketRoutes = require("./routes/supermarket_route");
morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :response-time ms - req-body: :req-body", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/supermarkets", supermarketRoutes);

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

app.listen(3001, () => {});

module.exports = app;
