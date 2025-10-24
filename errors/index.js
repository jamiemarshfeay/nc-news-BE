const handleNonPathErrors = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

const handlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "You have made a bad request" });
  } else if (err.code === "23503" && (!err.status && !err.msg)) {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = {
  handleNonPathErrors,
  handlePostgresErrors,
  handleCustomErrors,
  handleServerErrors,
};
