const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("routes index");
  res.render("index");
});

router.get("/signup", (re, res, next) => {
  res.render("signup");
});

router.get("/login", (re, res, next) => {
  res.render("login");
});

module.exports = router;
