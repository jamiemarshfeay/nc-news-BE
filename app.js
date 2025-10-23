const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controllers.js");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles_controllers.js");
const { getUsers } = require("./controllers/users_controllers.js");
const {
  handleNonPathErrors,
  handlePostgresErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

// app.use(handleNonPathErrors);

// app.use(handlePostgresErrors);

// app.use(handleCustomErrors);

// app.use(handleServerErrors);

module.exports = app;
