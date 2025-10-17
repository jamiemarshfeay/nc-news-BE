\c nc_news;

-- SELECT * FROM topics;
-- SELECT * FROM articles;
-- SELECT * FROM users;
-- SELECT * FROM comments;

SELECT users.name, users.username
FROM users;

SELECT articles.title
FROM articles
WHERE articles.topic = 'coding';

SELECT comments.comment_id
FROM comments
WHERE comments.votes < 0;

SELECT topics.slug FROM topics;

SELECT users.username, articles.title
FROM users
LEFT JOIN articles ON articles.author = users.username
WHERE users.username = 'grumpy19';

SELECT comments.comment_id
FROM comments
WHERE comments.votes > 10;

