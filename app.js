const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controllers.js");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchVotesByArticleId,
} = require("./controllers/articles_controllers.js");
const { getUsers } = require("./controllers/users_controllers.js");
const { deleteCommentById } = require("./controllers/comments_controllers.js");
const {
  handleNonPathErrors,
  handlePostgresErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index.js");

app.use(express.json());

app.use("/api", express.static("public"));

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handleNonPathErrors);

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
