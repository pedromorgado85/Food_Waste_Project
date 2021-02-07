const express = require("express");
const router = express.Router();
const Person = require("../models/Users/Person");

router.get("/person/:id", (req, res, next) => {
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
