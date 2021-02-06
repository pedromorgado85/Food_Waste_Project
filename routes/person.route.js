const express = require("express");
const company = require("../models/Person");

router.get("/person/:id", (req, res, next) => {
  console.log(req.session);

  res.render("/person", { person: req.session.currentUser });
});
