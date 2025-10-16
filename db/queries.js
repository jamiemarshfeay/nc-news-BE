const format = require("pg-format");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../data/development-data/index.js");
const db = require("../connection");

function queryTheDatabase() {
    return db.query()
}

