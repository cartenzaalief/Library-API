const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const PORT = process.env.PORT;
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Library Labs API");
});

// Check sequelize connection
const { checkSequelize, dbSequelize } = require("./src/config/db");
checkSequelize();
dbSequelize.sync();

// Config routers
const { usersRouter } = require("./src/routers");
app.use("/users", usersRouter);

app.listen(PORT, () => console.log(`Running API ${PORT}`));
