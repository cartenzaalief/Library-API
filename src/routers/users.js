const { application } = require("express");
const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");

route.get("/", usersController.getUsersData);
route.post("/login", usersController.login);
route.post("/register", usersController.register);

module.exports = route;
