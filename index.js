import express from "express";
import configureMiddleware from "./config/middleware.js";
import authentication from "./controller/auth.js";
import categories from "./controller/categories.js";
import books from "./controller/books.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
configureMiddleware(app);

app.use(authentication);
app.use(categories);
app.use(books);

const port = process.env.APP_PORT || 5001;
app.listen(port, () => {
  console.log(`running server on port ${port}`);
});