const {
  readArticles,
  readArticleById,
} = require("../models/articles_models");

const getArticles = (req, res) => {
  readArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

const getArticleById = (req, res) => {
  readArticleById().then((article) => {
    res.status(200).send({ article: article });
  });
};

module.exports = { getArticles, getArticleById };
