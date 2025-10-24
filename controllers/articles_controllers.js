const {
  readArticles,
  readArticleById,
  readCommentsByArticleId,
  checkArticleExists,
  insertCommentToArticle,
} = require("../models/articles_models");

const getArticles = (req, res) => {
  return readArticles().then((articles) => {
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

  return readArticleById(article_id)
    .then((article) => {
      return insertCommentToArticle(username, body, article);
    })
    .then((comment) => {
      res.status(200).send({ comment: comment });
    });
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
};
