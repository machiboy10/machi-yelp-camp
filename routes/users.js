const express = require('express');
const router = express.Router();
const {renderRegister, register, renderLogin, login, logout} = require('../controllers/users');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');



router.get('/register', renderRegister)

router.post('/register', catchAsync(register))

router.get('/login', renderLogin)

router.post('/login', 
passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
login) 

router.get('/logout', logout)














module.exports = router;