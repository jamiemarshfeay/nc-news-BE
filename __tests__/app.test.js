const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
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
    test("responds with a success status when connected to the api and accesses an array of the articles", () => {
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
    test("tests the articles are returned in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          for (let i = 1; i < articles.length; i++) {
            expect(articles[i].created_at <= articles[i - 1].created_at).toBe(
              true
            );
          }
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
  xdescribe("POST /:article_id/comments", () => {
    test("responds with a 400 status when passed a completely invalid ID before `/comments`", () => {
      const testBody = {
        username: "space_cowboy",
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
    test.only("responds with a 404 status when passed a valid possible ID before `/comments`, but one that does not exist", () => {
      // need to do a checkArticleExists function first
      const testBody = {
        username: "space_cowboy",
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
    xtest("responds with a 400 status when passed a body that does not contain the correct fields", () => {
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
    xtest("responds with a 400 status when passed a body that contains valid fields but the value of one, or multiple, of the fields is invalid", () => {
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
    xtest("responds with a 200 status and returns the new comment object, when passed a valid ID with a valid body", () => {
      const testBody = {
        username: "space_cowboy",
        body: "This is the return of the space cowboy",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(testBody)
        .expect(200)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment.article_id).toBe(5);
          expect(comment.username).toBe(testBody.username);
          expect(comment.body).toBe(testBody.body);
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
