const db = require("../db/connection");

function readTopics() {
    return db.query(
        `SELECT * FROM topics;`
    ).then(({ rows }) => {
        return rows;
    });
}

function readArticles() {
    return db.query(
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
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    ).then(({ rows }) => {
        return rows;
    });
}

module.exports = { readTopics, readArticles };
