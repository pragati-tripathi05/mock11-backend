const express = require("express");
const connection = require("./Config/db");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const cors = require("cors");

const authentication = require("./Middlewares/Authentication");
const { userSignup, userLogin } = require("./Controllers/user.controller");
const { dashboard } = require("./Controllers/dashboard.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/signup", userSignup);

app.post("/login", cors(), userLogin);

app.get("/dashboard", cors(), authentication, dashboard);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to db successfully");
  } catch (err) {
    console.log("Error in db connection");
    console.log(err.message);
  }

  console.log(`Listening on port ${PORT}`);
});
