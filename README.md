# NC News Seeding

In order to connect to your databases, you'll need to set up their environments:

- In the main directory of the repository add two files, one for the development database, and one for the test database.
- Call the first file `.env.test` and the second `.env.development`.
- Within `.env.test` enter the follwing: `PGDATABASE=nc_news_test`. Within `.env.development` enter the following: `PGDATABASE=nc_news`. The contents of these files should now allow to connect to both databases locally.
- The `.gitignore` file should already include `.env.*` to ensure these environments are not pushed to git in future. If the file doesn't include `.env.*`, add it in.
