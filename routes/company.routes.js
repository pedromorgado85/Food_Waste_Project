const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Company = require("../models/Users/Company");
const fileUploader = require("../configs/cloudinary.config");
const { getCurrentUser } = require("../helpers");

router.get("/signup", (req, res) => res.render("company/signup"));

router.post("/signup", (req, res, next) => {
  console.log("New Company form data:", req.body);
  const { name, taxNumber, password, email } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hash) => {
      console.log(`New Company hash: ${hash}`);
      return Company.create({
        name,
        email,
        taxNumber,
        password: hash,
      });
    })
    .then((companyFromDb) => {
      console.log("New Company from db: ", companyFromDb);
      req.session.currentCompany = companyFromDb;
      res.redirect("/company/" + companyFromDb._id);
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => res.render("company/login"));

// TODO: Write router.post('/login')

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("company/login", {
      errorMessage: "Please enter name and password to login.",
    });
    return;
  }

  Company.findOne({ email })
    .then((companyFromDb) => {
      if (!companyFromDb) {
        res.render("company/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
      } else if (bcryptjs.compareSync(password, companyFromDb.password)) {
        req.session.currentCompany = companyFromDb;
        res.redirect("/company/" + companyFromDb._id);
      } else {
        res.render("company/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/:id/edit", (req, res) => {
  const { id } = req.params;

  Company.findById(id)
    .then((companyFromDb) => {
      const currentUser = getCurrentUser(req.session);
      console.log(companyFromDb);
      res.render("company/edit", {
        company: companyFromDb,
        currentUser,
      });
    })
    .catch((error) =>
      console.log(`Error while getting a single company for edit: ${error}`)
    );
});

router.post("/:id/edit", fileUploader.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, email, password, existingImage } = req.body;
  let image = existingImage;
  if (req.file) {
    image = req.file.path;
  }

  Company.findByIdAndUpdate(id, { name, email, password, image }, { new: true })
    .then((updatedCompany) => res.redirect(`/company/${updatedCompany._id}`))
    .catch((error) =>
      console.log(`Error while updating a single company: ${error}`)
    );
});

router.post("/:id/delete", (req, res) => {
  const { id } = req.params;
  Company.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/company/list");
    })
    .catch((error) => console.log(`Error while deleting a company: ${error}`));
});

router.get("/list", (req, res, next) => {
  Company.find()
    .then((companiesFromDb) => {
      console.log(companiesFromDb);
      res.render("company/list", {
        companies: companiesFromDb,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.session);
  Company.findById(req.params.id)
    .then((companyFromDb) => {
      res.render("company/profile", {
        company: companyFromDb,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
