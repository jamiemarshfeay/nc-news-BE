const { readTopics, readArticles } = require("../models/topics_models");

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

module.exports = { getTopics, getArticles };
