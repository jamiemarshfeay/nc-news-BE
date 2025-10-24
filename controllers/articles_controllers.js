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

  return Promise.all(requestPromises).then((comments) => {
    res.status(200).send({ comments: comments[1] });
  });
};

const postCommentByArticleId = (req, res) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return insertCommentByArticleId(username, body, article_id).then(
    (comment) => {
      res.status(200).send({ comment: comment });
    }
  );
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
};
