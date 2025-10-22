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

describe("GET /api/topics", () => {
  test("responds with a success status when connected to the api and accesses the topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
        const topics = body.topics;
        expect(topics);
        topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
        });
    });
  });
});

describe("GET /api/articles", () => {
  test("responds with a success status when connected to the api and accesses the articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
        const articles = body.articles;
        expect(articles);
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
            expect(articles[i].created_at <= articles[i - 1].created_at).toBe(true);
        }
    });
  });
  xtest("tests that there is no body property present on the articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
            expect(!article.body);
        });
    });
  });
});
