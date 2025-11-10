# NC News Application

Hosted API:  
https://nc-news-application-7t81.onrender.com/api  

> Note: Visiting the base URL (https...onrender.com) will return a 404 ('Path not found') by design. Please use one of the endpoints listed below.

---

### Project Summary

This project is a **RESTful API** for a news application. It provides programmatic access to data about articles, users, topics, and comments, allowing developers to retrieve, add, update, and delete information. The API is built using **Node.js**, **Express**, and **PostgreSQL**, structured using the **MVC pattern**, and tested thoroughly with **Jest** and **Supertest**.

---

### Minimum Versions Required

Before running the project locally, ensure you have the following installed:  
- **Node.js:** v24.9.0  
- **PostgreSQL:** v16.10  

You can confirm your versions with:  
`node -v`  
`psql --version`

---

### Cloning the Repository

Run the following command in your terminal, then navigate into the project directory:  
`git clone https://github.com/jamiemarshfeay/nc-news-BE.git`  
`cd nc-news-BE`

---

### Installing Dependencies

Install all required packages by running:  
`npm install`

---

### Setting up Environment Variables

To connect to your local databases, you’ll need two environment files:  

- Create `.env.development` and `.env.test` in the project’s root directory.  
- Inside `.env.development`, add:  
  `PGDATABASE=nc_news`  
- Inside `.env.test`, add:  
  `PGDATABASE=nc_news_test`  
- These files ensure your local setup connects to the correct databases.  
- The `.gitignore` file should already contain `.env.*` to ensure these files are not pushed to GitHub.  
  If it does not, add `.env.*` manually.

---

### Creating the Databases

Run: `npm run setup-dbs`  

This command runs the SQL in `db/setup-dbs.sql`, creating both the development and test databases.

---

### Seeding the Development Database

Populate the development database with data by running:  
`npm run seed`

---

### Running the Test Suites

Run: `npm test`  

This command executes all Jest test suites to verify that the API behaves as expected.

---

### Starting the Server

Start the server using:  
`npm start`  

The server will listen on **port 9090** by default. You can test the endpoints in your browser or using a tool such as **Insomnia** or **Postman**.

---

### Valid Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | /api | Loads the API documentation |
| GET | /api/topics | Returns all topics |
| GET | /api/articles | Returns all articles |
| GET | /api/articles/:article_id | Returns a single article by ID |
| PATCH | /api/articles/:article_id | Updates the vote count on an article |
| GET | /api/articles/:article_id/comments | Returns all comments for an article |
| POST | /api/articles/:article_id/comments | Adds a new comment to an article |
| DELETE | /api/comments/:comment_id | Deletes a comment by ID |
| GET | /api/users | Returns all users |

> Note: The `/api/articles` endpoint also accepts the optional query parameters `sort_by`, `order`, and `topic`.

---

