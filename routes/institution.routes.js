const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Institution = require("../models/Users/Institution");
const Donation = require("../models/Donation");
const Company = require("../models/Users/Company");
const Person = require("../models/Users/Person");
const fileUploader = require("../configs/cloudinary.config");
const { getCurrentUser, getCurrentUserType } = require("../helpers");

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
      } else if (bcryptjs.compareSync(password, institutionFromDb.password)) {
        req.session.currentInstitution = institutionFromDb;
        res.redirect("/institution/" + institutionFromDb._id);
      } else {
        res.render("institution/login", {
          errorMessage: "Incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

// MAKE A DONATION PROCESS
router.post("/:id/donation", (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;
  const currentUser = getCurrentUser(req.session);
  const currentUserType = getCurrentUserType(req.session);
  let donationId = null;

  Donation.create({
    donor_id: currentUser._id,
    donor_type: currentUserType,
    receiver_id: id,
    receiver_type: "institution",
    description,
  })
    .then((donationFromDb) => {
      donationId = donationFromDb._id;
      return Institution.findByIdAndUpdate(id, {
        $push: { donations: donationId },
      });
    })
    .then((institutionFromDb) => {
      if (currentUserType === "company") {
        return Company.findByIdAndUpdate(currentUser._id, {
          $push: { donations: donationId },
        });
      } else if (currentUserType === "person") {
        return Person.findByIdAndUpdate(currentUser._id, {
          $push: { donations: donationId },
        });
      }
    })
    .then((updatedUser) => {
      res.redirect(`/institution/${id}`);
    })
    .catch((error) => console.log(`Error while creating a donation: ${error}`));
});

router.get("/:id/edit", (req, res) => {
  const { id } = req.params;

  Institution.findById(id)
    .then((institutionToEdit) => {
      console.log(institutionToEdit);
      res.render("institution/edit", {
        institution: institutionToEdit,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((error) =>
      console.log(`Error while getting a single institution for edit: ${error}`)
    );
});

router.post("/:id/edit", fileUploader.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, email, password, existingImage } = req.body;
  let image = existingImage;
  if (req.file) {
    image = req.file.path;
  }

  Institution.findByIdAndUpdate(
    id,
    { name, email, password, image },
    { new: true }
  )
    .then((updatedInstitution) =>
      res.redirect(`/institution/${updatedInstitution._id}`)
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
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  Institution.findById(req.params.id)
    .populate({
      path: "donations",
      populate: { path: "donor_id", model: "Company" },
    })
    .then((institutionFromDb) => {
      //console.log(institutionFromDb);
      res.render("institution/profile", {
        institution: institutionFromDb,
        currentUser: getCurrentUser(req.session),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
