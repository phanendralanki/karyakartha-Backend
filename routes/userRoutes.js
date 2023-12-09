const express = require('express');
const router = express.Router();
const passport = require('passport');
//importing controllers
const {registerUser,authUser} = require('../controllers/userControllers');

router.route('/register').post(registerUser);
router.post('/login',authUser);

//Google sign up
router.get('/google/signup',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/signup/callback',passport.authenticate('google',{failureRedirect:'/login'}),(req,res)=>{
    //successful Google Sign-In
    res.redirect('/'); //Redirecting to the page    

});

module.exports = router;