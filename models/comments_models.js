const db = require("../db/connection");

function checkCommentExists(id) {
  return db.query(
    `SELECT * FROM comments
    WHERE comment_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
}

function removeCommentById(id) {
  return db.query(
    `DELETE from comments
    WHERE comment_id = $1;`,
    [id]
  );
}

module.exports = {
  removeCommentById,
  checkCommentExists,
};
