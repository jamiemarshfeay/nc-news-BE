const format = require("pg-format");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../data/development-data/index.js");
const db = require("../connection");
const { convertTimestampToDate, createLookupObj } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS topics;
  `)
  .then(() => {
    return db.query(`
      CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000)
      );
    `);
  })
  .then(() => {
    return db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(1000)
      );
    `);
  })
  .then(() => {
    return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        votes INT NOT NULL DEFAULT 0,
        article_img_url VARCHAR(1000)
      );
    `);
  })
  .then(() => {
    return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT NOT NULL REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT NOT NULL DEFAULT 0,
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  })
  .then(() => {
    const nestedArrOfTopics = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url];
    });
    const topicsInsertStr = format(
      `INSERT INTO topics (slug, description, img_url)
      VALUES %L`,
      nestedArrOfTopics
    );
    return db.query(topicsInsertStr);
  })
  .then(() => {
    const nestedArrOfUsers = userData.map((user) => {
      return [user.username, user.name, user.avatar_url];
    });
    const usersInsertStr = format(
      `INSERT INTO users (username, name, avatar_url)
      VALUES %L`,
      nestedArrOfUsers
    );
    return db.query(usersInsertStr);
  })
  .then(() => {
    const nestedArrOfArticles = articleData.map((article) => {
      return [
        convertTimestampToDate(article).title,
        convertTimestampToDate(article).topic,
        convertTimestampToDate(article).author,
        convertTimestampToDate(article).body,
        convertTimestampToDate(article).created_at,
        convertTimestampToDate(article).votes,
        convertTimestampToDate(article).article_img_url,
      ];
    });
    const articlesInsertStr = format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L RETURNING *`,
      nestedArrOfArticles
    );
    return db.query(articlesInsertStr);
  })
  .then(({ rows }) => {
    const articleLookup = createLookupObj(rows, "title", "article_id")
    const nestedArrOfComments = commentData.map((comment) => {
      return [
        articleLookup[comment.article_title],
        convertTimestampToDate(comment).body,
        convertTimestampToDate(comment).votes,
        convertTimestampToDate(comment).author,
        convertTimestampToDate(comment).created_at,
      ];
    });
    const commentsInsertStr = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at)
      VALUES %L`,
      nestedArrOfComments
    );
    return db.query(commentsInsertStr);
  });
};

module.exports = seed;
