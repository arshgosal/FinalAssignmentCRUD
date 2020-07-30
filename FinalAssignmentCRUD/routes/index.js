'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Username already exists please login.');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});

/*GET for register*/
router.get('/register', function (req, res) {
    res.render('register');
});

/*GET for login*/
router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/products', function (req, res) {
    res.render('products');
});

/* GET insert page. */
router.get('/insert', function (req, res) {
    res.render('insert');
});

/* POST insert page */
router.post('/insert', function (req, res) {
    //Create a new article using the Articles Model Schema
    const item = new itemsModel({ name: req.body.name, description: req.body.description, price: req.body.price });
    //Insert article into DB
    item.save(function (err) {
        console.log(err);
        res.redirect('/products');
    });
});

/* GET update page */
router.get('/update/:id', function (req, res) {
    itemsModel.findById(req.params.id, function (err, foundArticle) {
        if (err) console.log(err);
        //Render update page with specific article
        res.render('update', { article: foundItem })
    })
});

/* POST update page */
router.post('/update', function (req, res) {
    console.log(req.body);
    //Find and update by id
    itemsModel.findByIdAndUpdate(req.body.id, { name: req.body.name, description: req.body.description, price: req.body.price }, function (err, model) {
        console.log(err);
        res.redirect('/products');
    });
});

/* POST delete page */
router.post('/delete/:id', function (req, res) {
    //Find and delete article
    itemsModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.redirect('/products');
    });
});
module.exports = router;
