const express = require("express");
const route = express.Router();
const { booksController } = require("../controllers");
const { uploader } = require("../config/uploader");

route.get("/", booksController.getBooksData);
route.post(
  "/addbook",
  uploader("/bookCover", "BOOKCOVER").array("images", 1),
  booksController.addBook
);

module.exports = route;
