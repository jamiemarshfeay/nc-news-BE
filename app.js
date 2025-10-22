const express = require("express");
const app = express();
const db = require("./db/connection.js");
const {
  getTopics,
  getArticles,
  getUsers,
} = require("./controllers/topics_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

module.exports = app;
