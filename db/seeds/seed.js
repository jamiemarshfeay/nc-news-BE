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
        description VARCHAR(255),
        img_url VARCHAR(1000)
      );
    `);
  })
  .then(() => {
    return db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        avatar_url VARCHAR(1000)
      );
    `);
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
    `);
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
    // console.log(articleLookup, '<<<< object of articles and their IDs')
    console.log(articleLookup['Making sense of Redux'], '<<<< should be an ID number for the article')
    // console.log(commentData[1], '<<<< what an individual comment object looks like')
    const nestedArrOfComments = commentData.map((comment) => {
      return [
        articleLookup[comment.article_title],
        // convertTimestampToDate(comment).article_id,
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
