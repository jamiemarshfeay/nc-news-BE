const {
  readArticles,
  readArticleById,
  readCommentsByArticleId,
  checkArticleExists,
  insertCommentToArticle,
  amendArticleVotes,
} = require("../models/articles_models");

const getArticles = (req, res) => {
  const { sort_by, order } = req.query;
  return readArticles(sort_by, order).then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

const getArticleById = (req, res) => {
  const { article_id } = req.params;
  return readArticleById(article_id).then((article) => {
    res.status(200).send({ article: article });
  });
};

const getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;
  const requestPromises = [readCommentsByArticleId(article_id)];

  if (article_id) {
    requestPromises.unshift(checkArticleExists(article_id));
  }

  return Promise.all(requestPromises).then((results) => {
    res.status(200).send({ comments: results[1] });
  });
};

const postCommentToArticle = (req, res) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (typeof username === "string" && typeof body === "string") {
    return checkArticleExists(article_id)
      .then(() => {
        return insertCommentToArticle(username, body, article_id);
      })
      .then((comment) => {
        res.status(200).send({ comment: comment });
      });
  } else {
    return Promise.reject({ status: 400, msg: "You have made a bad request" });
  }
};

const patchVotesByArticleId = (req, res) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes === "number") {
    return checkArticleExists(article_id)
      .then(() => {
        return amendArticleVotes(inc_votes, article_id);
      })
      .then((article) => {
        res.status(200).send({ article: article });
      });
  } else {
    return Promise.reject({ status: 400, msg: "You have made a bad request" });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchVotesByArticleId,
};
