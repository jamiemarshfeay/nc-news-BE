const db = require("./connection.js");

// db.query(`
//     SELECT users.name, users.username
//     FROM users;
// `).then(({ rows }) => {
//   console.log(rows);
// });


// db.query(`
//     SELECT articles.title, articles.topic
//     FROM articles
//     WHERE articles.topic = 'coding';
// `).then(({ rows }) => {
//   console.log(rows);
// });


// db.query(`
//     SELECT comments.comment_id, comments.votes
//     FROM comments
//     WHERE comments.votes < 0;
// `).then(({ rows }) => {
//   console.log(rows);
// });


// db.query(`
//     SELECT topics.slug FROM topics;
// `).then(({ rows }) => {
//   console.log(rows);
// });


// db.query(`
//     SELECT users.username, articles.title
//     FROM users
//     LEFT JOIN articles ON articles.author = users.username
//     WHERE users.username = 'grumpy19';
// `).then(({ rows }) => {
//   console.log(rows);
// });


db.query(`
    SELECT comments.comment_id, comments.votes
    FROM comments
    WHERE comments.votes > 10;
`).then(({ rows }) => {
  console.log(rows);
});
