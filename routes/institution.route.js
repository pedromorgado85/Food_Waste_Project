const express = require("express");
const router = express.Router();
const Institution = require("../models/Institution");

router.get("/institution/:id", (req, res, next) => {
  Institution.findById(req.params.id)
    .then((institutionFromDb) => {
      // const isCurrentUser = institutionFromDb.id === req.session.currentUser.id;
      res.render("institution", {
        institution: institutionFromDb,
        // isCurrentUser: isCurrentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
