import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const configureMiddleware = (app) => {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5500",
        "https://vancitywayne.github.io",
      ],
      methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

export default configureMiddleware;