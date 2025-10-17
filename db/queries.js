const format = require("pg-format");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("./data/development-data/index.js");
const db = require("./connection");

const queryTheDatabase = () => {
    return db.query(`
      SELECT users.name, users.username
      FROM users;
    `)
    .then(() => {
      return db.query(`
        SELECT * FROM articles
        WHERE articles.topic = 'coding';
      `);
    }).then(() => {
      return db.query(`
        SELECT * FROM comments
        WHERE comments.votes < 0;
      `);
    }).then(() => {
      return db.query(`
        SELECT topics.slug FROM topics;
      `);
    }).then(() => {
      return db.query(`
        SELECT users.username, articles.article_title
        FROM users
        LEFT JOIN articles ON articles_author = users.username;
      `);
    })
};

module.exports = queryTheDatabase;
