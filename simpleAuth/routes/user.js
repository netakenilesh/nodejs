const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => {
    console.log(req.body);
    const {name, email, password, cpassword} = req.body;
    
    const errors = [];
    if (!name || !email || !password || !cpassword) {
        errors.push({
            msg: 'Please enter all values'
        })
    }

    if(password !== cpassword) {
        errors.push({
            msg: 'password and confirm password does not match'
        })
    }

    if(password.length < 6) {
        errors.push({
            msg: 'password length should be greater than 6'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        })
    }
    else{
        // validation passes
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    errors.push({
                        msg: 'Email id already registered.'
                    })
                    res.render('register', {
                        errors,
                        name,
                        email
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    console.log(newUser);
                    // Create hashed password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            newUser.password = hash; 
                            //save user
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You registred successfully.')
                                res.redirect('/user/login');
                            })
                            .catch(err => {console.log(err)})
                    }))
                }
            })

    }
})


// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', "You are successfully logout")
    res.redirect('/user/login');
})
module.exports = router;