const { application } = require("express");
const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");
const { readToken } = require("../config/encript");
const { checkUser } = require("../config/validator");

route.get("/", usersController.getUsersData);
route.post("/login", usersController.login);
route.post("/register", checkUser, usersController.register);
route.get("/keep", readToken, usersController.keepLogin);

module.exports = route;
