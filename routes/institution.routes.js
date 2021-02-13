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
    .then((institutionFromDb) => {
      console.log("New Institution from Database: ", institutionFromDb);
      req.session.currentInstitution = institutionFromDb;
      res.redirect("/institution/" + institutionFromDb._id);
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
    .then((institutionFromDb) => {
      if (!institutionFromDb) {
        res.render("institution/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
      } else if (bcryptjs.compareSync(password, institutionFromDB.password)) {
        req.session.currentInstitution = institutionFromDb;
        res.render("institution/profile", { institution: institutionFromDb });
      } else {
        res.render("institution/login", {
          errorMessage: "Incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.get("/:id/edit", (req, res) => {
  const { id } = req.params;

  Institution.findById(id)
    .then((institutionToEdit) => {
      console.log(institutionToEdit);
      res.render("institution/edit", (institution: institutionToEdit));
    })
    .catch((error) =>
      console.log(`Error while getting a single institution for edit: ${error}`)
    );
});

router.post("/:id/edit", (req, res) => {
  const { id } = req.params;
  const { name, taxNumber, email, password } = req.body;

  Institution.findByIdAndUpdate(
    id,
    { name, taxNumber, email, password },
    { new: true }
  )
    .then((updatedInstitution) =>
      res.redirect(`/institution/profile${updatedInstitution._id}`)
    )
    .catch((error) =>
      console.log(`Error while updating a single institution: ${error}`)
    );
});

router.post("/:id/delete", (req, res) => {
  const { id } = req.params;

  Institution.findByIdAndDelete(id)
    .then(() => res.redirect("/institution/list"))
    .catch((error) =>
      console.log(`Error while deleting a institution: ${error}`)
    );
});

router.get("/list", (req, res, next) => {
  console.log(req.session);
  Institution.find()
    .then((institutionsFromDb) => {
      console.log(institutionsFromDb);
      res.render("institution/list", {
        institutions: institutionsFromDb,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.session);
  Institution.findById(req.params.id)
    .then((institutionFromDb) => {
      const isCurrentUser =
        institutionFromDb.id === req.session.currentInstitution.id;
      console.log(`Sou a  mesma pessoa que ta na sessao?`, isCurrentUser);
      res.render("institution/profile", {
        institution: institutionFromDb,
        isCurrentUser: isCurrentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
