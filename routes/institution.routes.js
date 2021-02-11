const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Institution = require("../models/Users/Institution");

router.get("/signup", (req, res) => {
  res.render("institution/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("New Institution form data: ", req.body);
  const { name, taxNumber, password, email } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hash) => {
      console.log(`New Institution hash: ${hash}`);
      return Institution.create({
        name,
        email,
        taxNumber,
        password: hash,
      });
    })
    .then((institutionFromDB) => {
      console.log("New Institution from Database: ", institutionFromDB);
      res.redirect("/institution/login");
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => res.render("institution/login"));

// TODO: Write router.post('/login')

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("institution/login", {
      errorMessage: "Please enter name and password to login.",
    });
    return;
  }

  Institution.findOne({ email })
    .then((institutionFromDB) => {
      if (!institutionFromDB) {
        res.render("institution/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
      } else if (bcryptjs.compareSync(password, institutionFromDB.password)) {
        res.render("institution/profile", { institution: institutionFromDB });
      } else {
        res.render("institution/login", {
          errorMessage: "Incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.get("/list", (req, res, next) => {
  console.log(req.session);
  Institution.find()
    .then((institutionsFromDB) => {
      console.log(institutionsFromDB);
      res.render("institution/list", {
        institutions: institutionsFromDB,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  Institution.findById(req.params.id)
    .then((institutionFromDb) => {
      // const isCurrentUser = institutionFromDb.id === req.session.currentUser.id;
      res.render("institution/profile", { institution: institutionFromDb });
      // isCurrentUser: isCurrentUser,
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
