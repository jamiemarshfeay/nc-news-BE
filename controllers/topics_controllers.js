const { readTopics } = require("../models/topics_models");

const getTopics = (req, res) => {
    readTopics().then((topics) => {
        res.status(200).send({ topics: topics });
    });
};

module.exports = { getTopics };
