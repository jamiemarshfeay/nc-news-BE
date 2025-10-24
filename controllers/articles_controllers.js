const {
  readArticles,
  readArticleById,
  readCommentsByArticleId,
  checkArticleExists,
  insertCommentByArticleId,
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

const postCommentByArticleId = (req, res) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const requestPromises = [
    insertCommentByArticleId(username, body, article_id),
  ];

  if (article_id) {
    requestPromises.unshift(checkArticleExists(article_id));
  }

  return Promise.all(requestPromises).then(
    (results) => {
      res.status(200).send({ comment: results[1] });
    }
  );
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
};
