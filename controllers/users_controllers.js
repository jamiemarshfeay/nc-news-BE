const { readUsers } = require("../models/users_models");

const getUsers = (req, res) => {
  readUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

module.exports = { getUsers };
