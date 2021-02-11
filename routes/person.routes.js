const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Person = require("../models/Users/Person");

router.get("/signup", (req, res) => res.render("person/signup"));

router.post("/signup", (req, res, next) => {
  console.log("New Person form data: ", req.body);
  const { name, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hash) => {
      console.log(`New Person hash: ${hash}`);
      return Person.create({
        name,
        email,
        password: hash,
      });
    })
    .then((personFromDb) => {
      console.log("New Person from db: ", personFromDb);
      res.redirect("/person/login");
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => res.render("person/login"));

// TODO: Write router.post('/login')

router.post("/login", (req, res, next) => {
  const { name, password } = req.body;

  if (name === "" || password === "") {
    res.render("person/login", {
      errorMessage: "Please enter name and password to login.",
    });
    return;
  }

  Person.findOne({ name })
    .then((user) => {
      if (!user) {
        res.render("person/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
        return;
      } else if (bcryptjs.compareSync(password, person.passwordHash)) {
        res.render("person/profile", { person });
      } else {
        res.render("person/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((personFromDb) => {
      // const isCurrentUser = personFromDb.id === req.session.currentUser.id;
      res.render("users/person", {
        person: personFromDb,
        // isCurrentUser: isCurrentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
