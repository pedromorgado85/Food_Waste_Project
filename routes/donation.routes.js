const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Company = require('../models/Users/Company');

router.get('/donation/:id', (req, res, next) => {
  // console.log(req.session);
  // res.render('/donation', { donation: req.session.currentUser });
});

module.exports = router;
