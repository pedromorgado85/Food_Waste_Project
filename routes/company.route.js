const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

router.get("/company/:id", (req, res, next) => {
  Company.findById(req.params.id)
    .then((companyFromDb) => {
      //const isCurrentUser = companyFromDb.id === req.session.currentUser.id;
      res.render("company", {
        company: companyFromDb,
        //  isCurrentUser: isCurrentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
