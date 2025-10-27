const db = require("../db/connection");

function readArticles(sort_by = "created_at", order = "DESC", topic) {
  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderOptions = ["ASC", "DESC"];
  const validTopicFilters = [
    "mitch",
    "cats",
    "paper",
    "coding", 
    "football",
    "cooking",
  ];
  
  if (
    !validSortColumns.includes(sort_by) ||
    !validOrderOptions.includes(order) ||
    (topic && !validTopicFilters.includes(topic))
  ) {
    return Promise.reject({ status: 400, msg: "You have made a bad request" });
  }
  
  let whereCondition = "";
  const queryValues = [];
  if (topic) {
    queryValues.push(topic);
    whereCondition = `WHERE articles.topic = $1`;
  }

  const queryStr =
      `SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments
            ON articles.article_id = comments.article_id
        ${whereCondition}
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
      `;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
}

function readArticleById(id) {
  return db.query(
      `SELECT * FROM articles
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function readCommentsByArticleId(id) {
  return db.query(
      `SELECT
            comments.comment_id,
            comments.votes,
            comments.created_at,
            comments.author,
            comments.body,
            comments.article_id
      FROM comments
      LEFT JOIN articles
        ON comments.article_id = articles.article_id
      WHERE comments.article_id = $1
      ORDER BY comments.created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function checkArticleExists(id) {
  return db.query(
    `SELECT * FROM articles
    WHERE article_id = $1`,
    [id]
  )
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
  });
}

function insertCommentToArticle(username, body, id) {
  return db.query(
      `INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [username, body, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function amendArticleVotes(inc_votes, id) {
  return db.query(
    `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
    [inc_votes, id]
  )
  .then(({ rows }) => {
    return rows[0];
  });
}

module.exports = {
  readArticles,
  readArticleById,
  readCommentsByArticleId,
  checkArticleExists,
  insertCommentToArticle,
  amendArticleVotes,
};
