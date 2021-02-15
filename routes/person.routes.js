const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Person = require("../models/Users/Person");
const fileUploader = require("../configs/cloudinary.config");
const getCurrentUser = require("../helpers");

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
      req.session.currentPerson = personFromDb;
      res.redirect("/person/" + personFromDb._id);
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => res.render("person/login"));

// TODO: Write router.post('/login')

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("person/login", {
      errorMessage: "Please enter name and password to login.",
    });
    return;
  }

  Person.findOne({ email })
    .then((personFromDb) => {
      if (!personFromDb) {
        res.render("person/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
      } else if (bcryptjs.compareSync(password, personFromDb.password)) {
        req.session.currentPerson = personFromDb;
        res.render("person/profile", { person: personFromDb });
      } else {
        res.render("person/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/:id/edit", (req, res) => {
  const { id } = req.params;

  Person.findById(id)
    .then((personToEdit) => {
      const currentUser = getCurrentUser(req.session);
      console.log(personToEdit);
      res.render("person/edit", {
        person: personToEdit,
        currentUser,
      });
    })
    .catch((error) =>
      console.log(`Error while getting a single person for edit: ${error}`)
    );
});

router.post("/:id/edit", fileUploader.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, email, password, existingImage } = req.body;
  let image = existingImage;
  if (req.file) {
    image = req.file.path;
  }

  Person.findByIdAndUpdate(id, { name, email, password, image }, { new: true })
    .then((updatedPerson) => res.redirect(`/person/${updatedPerson._id}`))
    .catch((error) =>
      console.log(`Error while updating a single person: ${error}`)
    );
});

router.post("/:id/delete", (req, res) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/person/list");
    })
    .catch((error) => console.log(`Error while deleting a person: ${error}`));
});

router.get("/list", (req, res, next) => {
  Person.find()
    .then((peopleFromDb) => {
      console.log(peopleFromDb);
      res.render("person/list", {
        people: peopleFromDb,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.session);
  Person.findById(req.params.id)
    .then((personFromDb) => {
      res.render("person/profile", {
        person: personFromDb,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
