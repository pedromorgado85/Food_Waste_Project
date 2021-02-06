const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Company = require("../models/Users/Company");
const Institution = require("../models/Users/Institution");
const Person = require("../models/Users/Person");

// .get() route ==> to display the signup form to users
//do i need a router.get for general signup?

router.get("/signup-company", (req, res) => res.render("auth/signup-company"));
router.get("/signup-person", (req, res) => res.render("auth/signup-person"));
router.get("/login", (req, res) => res.render("auth/login"));

// .post() route ==> to process form data

router.post("/signup-company", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { name, taxnumber, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return Company.create({
        // name:name
        name,
        email,
        taxnumber,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));
});

router.post("/signup-person", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { name, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return Person.create({
        // name:name
        name,
        email,
        taxnumber,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));
});

router.post("/signup-institution", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { name, taxnumber, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return Institution.create({
        // name:name
        name,
        email,
        taxnumber,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/institution");
    })
    .catch((error) => next(error));
});

module.exports = router;
