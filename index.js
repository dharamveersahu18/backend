require("dotenv").config();

const express = require("express");
// import expres from "express"
const app = express();

const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/twitter", (req, res) => {
  res.send("Dharam.com");
});
app.get("/login", (res, req) => {
  res.send("<h1> Please login at app </h1>");
});

app.get("/youtube", () => {
  res.send("<h3> Welcoome guysss</h3>");
});
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
