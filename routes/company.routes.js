const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const Company = require('../models/Users/Company');

router.get('/signup', (req, res) => res.render('company/signup'));

router.post('/signup', (req, res, next) => {
  console.log('New Company form data:', req.body);
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
    .then((companyFromDB) => {
      console.log('New Company from db: ', companyFromDB);
      res.redirect('/company/login');
    })
    .catch((error) => next(error));
});

router.get('/login', (req, res) => res.render('company/login'));

// TODO: Write router.post('/login')

router.get('/:id', (req, res, next) => {
  Company.findById(req.params.id)
    .then((companyFromDb) => {
      //const isCurrentUser = companyFromDb.id === req.session.currentUser.id;
      res.render('company/profile', {
        company: companyFromDb,
        //  isCurrentUser: isCurrentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
