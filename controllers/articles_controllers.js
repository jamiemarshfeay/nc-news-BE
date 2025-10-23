const {
  readArticles,
  readArticleById,
  readCommentByArticleId,
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

const getCommentByArticleId = (req, res) => {
  const { article_id } = req.params;
  return readCommentByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments: comments });
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
  getCommentByArticleId,
  postCommentByArticleId,
};
