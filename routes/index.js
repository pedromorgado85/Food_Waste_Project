const express = require("express");
const router = express.Router();
const { getCurrentUser } = require("../helpers");

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("routes index");
  res.render("index", { currentUser: getCurrentUser(req.session) });
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
