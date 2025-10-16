const format = require("node-pg-format");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../data/development-data/index.js");
const db = require("../connection");

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
        description VARCHAR(255),
        img_url VARCHAR(1000)
      );
    `)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        avatar_url VARCHAR(1000)
      );
    `)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        topic VARCHAR(255) REFERENCES topics(slug),
        author VARCHAR(255) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
      );
    `)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(255) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
  });
    

  // const nestedArrOfTopics = topicData.map((topic) => {
  //   return [topic.slug, topic.description, topic.img_url];
  // })

  // const nestedArrOfUsers = userData.map((user) => {
  //   return [user.username, user.name, user.avatar_url];
  // })

  // const nestedArrOfArticles = articleData.map((article) => {
  //   return [article.article_id, article.title, article.topic, article.author, article.body, article.created_at, article.votes, article.article_img_url];
  // })

  // const nestedArrOfComments = commentData.map((comment) => {
  //   return [comment.comment_id, comment.article_id, comment.body, comment.votes, comment.author, comment.created_at];
  // })

  // const topicsInsertStr = format(
  //   `INSERT INTO topics (slug, description, img_url)
  //     VALUES %L`,
  //     nestedArrOfTopics
  // );

  // const usersInsertStr = format(
  //   `INSERT INTO topics (username, name, avatar_url)
  //     VALUES %L`,
  //     nestedArrOfUsers
  // );

  // const articlesInsertStr = format(
  //   `INSERT INTO topics (article_id, title, topic, author, body, created_at, votes, article_img_url)
  //     VALUES %L`,
  //     nestedArrOfArticles
  // );

  // const commentsInsertStr = format(
  //   `INSERT INTO topics (comment_id, article_id, body, votes, author, created_at)
  //     VALUES %L`,
  //     nestedArrOfComments
  // );
};

module.exports = seed;
