const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
require("jest-sorted");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("ALL: *", () => {
  test("responds with a 404 status when a request is made to an undefined / non-existent endpoint `/notAnEndpoint`", () => {
    return request(app)
      .get("/notAnEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("responds with a 404 status when a request is made to an undefined / non-existent endpoint `/api/notAnEndpoint`", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("responds with a success status when connected to the api and accesses an array of the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(topics).toBeInstanceOf(Array);
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("responds with a success status when connected to the api and accesses an array of all the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
          });
        });
    });
    test("tests that each article has a comment count derived from the total number of comments with its respective ID", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          articles.forEach((article) => {
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("tests that there is no body property present on the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          articles.forEach((article) => {
            expect(article.body).toBe(undefined);
          });
        });
    });
    test("tests the articles are returned in descending date order when passed no query", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("tests the articles are sorted by a string column, and in reverse alphabetical order, when passed a 'sort_by' query with no 'order' query", () => {
      const strColumns = [
        "author",
        "title",
        "topic",
        "created_at",
        "article_img_url",
      ];
      const testRequests = strColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}`)
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSortedBy(column, { descending: true });
          });
      });
      return Promise.all(testRequests);
    });
    xtest("tests the articles are sorted by a number column, and in descending order, when passed a 'sort_by' query with no 'order' query", () => {
      const numColumns = ["article_id", "votes", "comment_count"];
      const testRequests = numColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}`)
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSortedBy(column, { descending: true });
          });
      });
      return Promise.all(testRequests);
    });
    xtest("tests the articles are sorted by date, and in ascending order, when passed an ASC 'order' query with no 'sort_by' query", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    xtest("tests the articles are sorted by date, and in descending order, when passed an DESC 'order' query with no 'sort_by' query", () => {
      return request(app)
        .get("/api/articles?order=DESC")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    xtest("tests the articles are sorted by a column, and in ascending order, when passed a 'sort_by' query with an ASC 'order' query", () => {
      const allColumns = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
      ];
      const testRequests = allColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}&order=ASC`)
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSortedBy(column, { descending: false });
          });
      });
      return Promise.all(testRequests);
    });
    xtest("tests the articles are sorted by a column, and in descending order, when passed a 'sort_by' query with a DESC 'order' query", () => {
      const allColumns = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
      ];
      const testRequests = allColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}&order=DESC`)
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSortedBy(column, { descending: true });
          });
      });
      return Promise.all(testRequests);
    });
    xtest("responds with a 400 status when passed an invalid 'sort_by' query", () => {
      return request(app)
        .get("/api/articles?sort_by=not_a_column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    xtest("responds with a 400 status when passed an invalid 'order' query", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
  });
  describe("GET /:article_id", () => {
    test("responds with a 400 status when passed a completely invalid ID", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 404 status when passed a valid possible ID, but one that does not exist", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("responds with a 200 status and accesses the article object when passed a valid ID", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(1);
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.votes).toBe(100);
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
  });
  describe("GET /:article_id/comments", () => {
    test("responds with a 400 status when passed a completely invalid ID before `/comments`", () => {
      return request(app)
        .get("/api/articles/stillNotAnId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 404 status when passed a valid possible ID before `/comments`, but one that does not exist", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("responds with 200 status and an empty array when passed a valid ID before `/comments`, but there are no comments relevant to that article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(0);
        });
    });
    test("responds with 200 status and an array of all comments from the particular article when passed a valid ID before `/comments`", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(2);
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(5);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
          });
        });
    });
    test("tests the comments are returned in descending date order", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          for (let i = 1; i < comments.length; i++) {
            expect(comments[i].created_at <= comments[i - 1].created_at).toBe(
              true
            );
          }
        });
    });
  });
  describe("POST /:article_id/comments", () => {
    test("responds with a 400 status when passed a completely invalid ID before `/comments`", () => {
      const testBody = {
        username: "icellusedkars",
        body: "This is the return of the space cowboy",
      };
      return request(app)
        .post("/api/articles/definitelyNotAnId/comments")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 404 status when passed a valid possible ID before `/comments`, but one that does not exist", () => {
      const testBody = {
        username: "icellusedkars",
        body: "This is the return of the space cowboy",
      };
      return request(app)
        .post("/api/articles/58/comments")
        .send(testBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("responds with a 400 status when passed a body that does not contain the correct fields", () => {
      const testBody = {
        birthstone: "diamond",
        faveFood: "steak",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 400 status when passed a body that contains valid fields but the value of one, or multiple, of the fields is invalid", () => {
      const testBody = {
        username: 10,
        body: true,
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 200 status and returns the new comment object, when passed a valid ID with a valid body", () => {
      const testBody = {
        username: "icellusedkars",
        body: "This is the return of the space cowboy",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(testBody)
        .expect(200)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment.article_id).toBe(5);
          expect(comment.author).toBe(testBody.username);
          expect(comment.body).toBe(testBody.body);
        });
    });
  });
  describe("PATCH /:article_id", () => {
    test("responds with a 400 status when passed a completely invalid ID", () => {
      const testBody = { inc_votes: 7 };
      return request(app)
        .patch("/api/articles/not_an_id")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 404 status when passed a valid possible ID, but one that does not exist", () => {
      const testBody = { inc_votes: 7 };
      return request(app)
        .patch("/api/articles/500")
        .send(testBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("responds with a 400 status when passed a body that does not contain the correct field", () => {
      const testBody = { invalidKey: 3 };
      return request(app)
        .patch("/api/articles/2")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 400 status when passed a body that contains a valid field but the value of that field is invalid", () => {
      const testBody = { inc_votes: "three" };
      return request(app)
        .patch("/api/articles/4")
        .send(testBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 200 status, updates, and accesses the article object when passed a valid ID, alongside a positive increment value", () => {
      const testBody = { inc_votes: 7 };
      return request(app)
        .patch("/api/articles/1")
        .send(testBody)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(107);
        });
    });
    test("responds with a 200 status, updates, and accesses the article object when passed a valid ID, alongside a negative increment value", () => {
      const testBody = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(testBody)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(50);
        });
    });
    test("responds with a 200 status, updates, and accesses the article object when passed a valid ID, alongside a positive increment value - all while any other properties on the article remain unchanged", () => {
      const testBody = { inc_votes: 36 };
      return request(app)
        .patch("/api/articles/1")
        .send(testBody)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(1);
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.votes).toBe(136);
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("responds with a success status when connected to the api and accesses the users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users).toBeInstanceOf(Array);
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });
});

describe("/api/comments", () => {
  describe("DELETE /:comment_id", () => {
    test("responds with a 400 status when passed a completely invalid ID", () => {
      return request(app)
        .delete("/api/comments/notACommentId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You have made a bad request");
        });
    });
    test("responds with a 404 status when passed a valid possible ID, but one that does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
    test("responds with a 204 success status and returns no content when passed a valid ID", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });
});
