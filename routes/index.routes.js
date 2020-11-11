const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
req.app.locals.loggedUser = req.session.currentUser; // Here we are setting up a local.
res.render('index', {user: req.session.currentUser});  // The user we logged in with.
});


// Set a middleware function.
function requireLogin(req, res, next) {  
    if (req.session.currentUser) {  
      next();
    } else {
      res.redirect('/login')
    }
  }


// create a first private route to main.
router.get('/private/main', requireLogin, (req, res) => {  
    res.render('private/main');
  });
  

// create a second private route to private.
router.get('/private/private', requireLogin, (req, res) => {  
    res.render('private/private');
  });
  




module.exports = router;
