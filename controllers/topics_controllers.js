const {
  readTopics,
  readArticles,
  readUsers,
} = require("../models/topics_models");

const getTopics = (req, res) => {
  readTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

const getArticles = (req, res) => {
  readArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

const getUsers = (req, res) => {
  readUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

module.exports = { getTopics, getArticles, getUsers };
