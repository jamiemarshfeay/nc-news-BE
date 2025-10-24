const {
  removeCommentById,
  checkCommentExists,
} = require("../models/comments_models");

const deleteCommentById = (req, res) => {
  const { comment_id } = req.params;

  return checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then((message) => {
      res.status(204).send(message);
    });
};

module.exports = {
  deleteCommentById,
};
