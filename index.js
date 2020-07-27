const express = require("express");
const app = express();
const Path = require("path");

const CODES = new Map();

app.get("/oauth/callback", (req, res) => {
  if (!req.query.code || !req.query.state) return res.status(400).json({ error: "Missing data" });
  const code = req.query.code;
  const state = req.query.state;
  // TODO: periodicly loop all cached tokens and remove any that are expired
  const data = {
    expired: false,
    code,
  };
  CODES.set(state, data);
  return res.sendFile(Path.join(__dirname, "success.html"));
});

app.get("/oauth/getcode", (req, res) => {
  if (!req.query.state) return res.status(400).json({ error: "Missing state" });
  if (!CODES.has(req.query.state)) return res.status(400).json({ error: "State not found" });
  const data = CODES.get(req.query.state);
  if (data.expired) return res.status(400).json({ error: "Expired" });
  data.expired = true;
  CODES.set(req.query.state, data);
  return res.json({ code: data.code });
});

app.listen(7000, () => console.log("Listening"));
