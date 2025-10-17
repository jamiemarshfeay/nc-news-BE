const db = require("./connection");

const queryTheDatabase = () => {
    return db.query(`
      SELECT users.name, users.username
      FROM users;
    `)
    .then(() => {
      return db.query(`
        SELECT articles.title
        FROM articles
        WHERE articles.topic = 'coding';
      `);
    }).then(() => {
      return db.query(`
        SELECT comments.comment_id
        FROM comments
        WHERE comments.votes < 0;
      `);
    }).then(() => {
      return db.query(`
        SELECT topics.slug FROM topics;
      `);
    }).then(() => {
      return db.query(`
        SELECT users.username, articles.title
        FROM users
        LEFT JOIN articles ON articles.author = users.username
        WHERE users.username = 'grumpy19';
      `);
    }).then(() => {
      return db.query(`
        SELECT comments.comment_id
        FROM comments
        WHERE comments.votes > 10;
      `);
    });
};

module.exports = queryTheDatabase;
