const db = require("../db/connection");

function readTopics() {
    return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows;
    });
}

function readArticles() {
    return db
    .query(`SELECT * FROM articles`)
    .then(({ rows }) => {
        return rows;
    });
}

module.exports = { readTopics, readArticles };
