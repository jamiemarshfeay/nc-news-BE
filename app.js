const express = require("express");
const app = express();
const db = require("./db/connection.js");
const { getTopics } = require("./controllers/topics_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

module.exports = app;
