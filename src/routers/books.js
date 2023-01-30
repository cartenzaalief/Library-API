const express = require("express");
const route = express.Router();
const { booksController } = require("../controllers");

route.get("/", booksController.getBooksData);

module.exports = route;
