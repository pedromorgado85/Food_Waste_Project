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

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
