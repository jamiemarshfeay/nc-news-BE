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
            expect(topic.slug);
            expect(topic.description);
        });
    });
  });
});
