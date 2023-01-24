const { application } = require("express");
const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");

route.get("/", usersController.getUsersData);
route.post("/login", usersController.login);

module.exports = route;
