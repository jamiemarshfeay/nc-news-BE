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
  const { article_id } = req.params;
  if (article_id) {
    readArticleById(article_id).then((article) => {
      res.status(200).send({ article: article });
    });
  } else {
    console.log(err)
    next(err);
  }
};

module.exports = { getArticles, getArticleById };
