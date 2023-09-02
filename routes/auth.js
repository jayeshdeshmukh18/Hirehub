const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');
const authController=require('../controllers/auth');

// APIs

router.get('/login',authController.loginForm)

router.post('/login',
passport.authenticate('local',{
    failureRedirect:'/login'
}),authController.loginLogic)

router.get('/signup',authController.registerForm)

router.post('/signup', authController.registerLogic)

router.get('/logout',authController.logoutUser)

module.exports=router;