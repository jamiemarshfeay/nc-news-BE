const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controllers.js");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles_controllers.js");
const { getUsers } = require("./controllers/users_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
