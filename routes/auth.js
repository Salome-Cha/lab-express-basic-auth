const express = require('express')
const router  = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const User = require('../models/User.model')


// Create the route to the signup form:
router.get('/signup', (req, res) => {
    res.render('auth/signup')
  })


// Create the post route to persist the new user account with hashed password:



router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    if (username === '' || password === '') {
      res.render('auth/signup', 
      { 
        errorMessage: 'Indicate username and password'
      });
      return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.render('auth/signup', 
      { 
        errorMessage: `Password needs to have at least 6 characteres and must contain at least
        one number and one uppercase letter.
        `
      });
      return;
    }
    User.findOne({'username': username})
      .then((user) => {
        if(user) { 
          res.render('auth/signup', {
            errorMessage: 'The username already exists, please login instead'
          });
          return;
        }
        User.create({ username, password: hashPassword})
          .then(() => {
            res.redirect('/');
          })
          .catch((error) => {
            if (error.code === 11000) {
              res.status(500).
              render('auth/signup', {
                errorMessage: 'Username and email need to be unique'
              })
            }
            })
          })
        });
    

// GET THE LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('auth/login')
  });


// POST ROUTE TO CHECK IF THE LOGIN IS OK.

router.post('/login', (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
      res.render('auth/login', {
        errorMessage: 'Please enter both username and password'
      });
      return;
    }
  
    User.findOne({'username': username})
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Invalid login'
        })
        return 
      }
  
      if (bcrypt.compareSync(password, user.password)) { 
        req.session.currentUser = user;  
        res.redirect('/');
      } 
      else {
        res.render('auth/login', {
          errorMessage: 'Invalid login' 
        })
      }
    });
  });
  

// LOGOUT
// LOGOUT
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
  })





 module.exports = router;