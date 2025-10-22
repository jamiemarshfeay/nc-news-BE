const express = require("express");
const app = express();
const db = require("./db/connection.js");

app.use(express.json());

app.get("/api/topics", (req, res) => {
  return db.query(`SELECT * FROM topics;`)
  .then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
});

module.exports = app;
