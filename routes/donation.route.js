const express = require("express");
const company = require("../models/Donation");

router.get("/donation/:id", (req, res, next) => {
  console.log(req.session);

  res.render("/donation", { donation: req.session.currentUser });
});
